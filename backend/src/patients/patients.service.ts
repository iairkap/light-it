import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(
    limit: number = 10,
    offset: number = 0,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ data: Patient[]; meta: any }> {
    const queryBuilder = this.patientsRepository.createQueryBuilder('patient');

    if (search) {
      queryBuilder.where(
        'patient.fullName ILIKE :search OR patient.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    // Whitelist allowed sort fields to prevent SQL injection or errors
    const allowedSortFields = ['fullName', 'email', 'createdAt'];
    let safeSortBy = 'patient.createdAt';

    if (allowedSortFields.includes(sortBy)) {
      if (sortBy === 'fullName' || sortBy === 'email') {
        safeSortBy = `LOWER(patient.${sortBy})`;
      } else {
        safeSortBy = `patient.${sortBy}`;
      }
    }

    const [data, total] = await queryBuilder
      .orderBy(safeSortBy, sortOrder)
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: Number(limit),
        totalPages,
        currentPage,
      },
    };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async create(
    createPatientDto: CreatePatientDto,
    photoUrl?: string,
  ): Promise<Patient> {
    // Validar que el email no exista
    const existingPatient = await this.patientsRepository.findOne({
      where: { email: createPatientDto.email },
    });

    if (existingPatient) {
      throw new ConflictException('Email already registered');
    }

    const sanitizedFullName = createPatientDto.fullName
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const patient = this.patientsRepository.create({
      ...createPatientDto,
      fullName: sanitizedFullName,
      documentPhotoUrl: photoUrl || 'placeholder.jpg',
    });

    const savedPatient = await this.patientsRepository.save(patient);

    this.eventEmitter.emit('patient.registered', savedPatient);

    return savedPatient;
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
  }
}

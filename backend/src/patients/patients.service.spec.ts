import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: Repository<Patient>;
  let eventEmitter: EventEmitter2;

  const mockPatient = {
    id: 'uuid',
    fullName: 'Juan Perez',
    email: 'juan.perez@gmail.com',
    phoneCountryCode: '+54',
    phoneNumber: '1122334455',
    documentPhotoUrl: '/uploads/photo.jpg',
    getFullPhoneNumber: jest.fn().mockReturnValue('+541122334455'),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get<Repository<Patient>>(getRepositoryToken(Patient));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated result of patients', async () => {
      const result = [[mockPatient], 1]; // [data, count]

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue(result),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const response = await service.findAll(10, 0);

      expect(response).toEqual({
        data: [mockPatient],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('patient');
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a patient if found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPatient as any);

      expect(await service.findOne('uuid')).toEqual(mockPatient);
    });

    it('should throw NotFoundException if patient not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreatePatientDto = {
      fullName: 'Juan Perez',
      email: 'juan.perez@gmail.com',
      phoneCountryCode: '+54',
      phoneNumber: '1122334455',
    };

    it('should create and save a patient', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockPatient as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockPatient as any);

      const result = await service.create(createDto, '/uploads/photo.jpg');

      expect(result).toEqual(mockPatient);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'patient.registered',
        mockPatient,
      );
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPatient as any);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a patient', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPatient as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockPatient as any);

      await service.remove('uuid');
      expect(repository.remove).toHaveBeenCalledWith(mockPatient);
    });
  });
});

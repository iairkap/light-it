import {
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('search') search?: string,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy?: string,
    @Query('order', new DefaultValuePipe('DESC')) order?: 'ASC' | 'DESC',
  ): Promise<{ data: Patient[]; meta: any }> {
    return this.patientsService.findAll(limit, offset, search, sortBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('documentPhoto'))
  create(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Patient> {
    if (!file) {
      throw new BadRequestException('Document photo is required');
    }

    // La URL será la ruta relativa en el servidor
    const photoUrl = `/uploads/${file.filename}`;
    return this.patientsService.create(createPatientDto, photoUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.patientsService.remove(id);
  }
}

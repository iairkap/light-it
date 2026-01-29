import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { multerConfig } from '../common/config/multer.config';
import { PatientRegisteredListener } from './listeners/patient-registered.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    MulterModule.register(multerConfig),
  ],
  controllers: [PatientsController],
  providers: [PatientsService, PatientRegisteredListener],
})
export class PatientsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Patient } from './patients/entities/patient.entity';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'patient_app',
      password:
        process.env.DATABASE_PASSWORD || 'dev_password_change_in_production',
      database: process.env.DATABASE_NAME || 'patient_registration',
      entities: [Patient],
      synchronize: process.env.NODE_ENV === 'development', // Only sync in dev
      logging: process.env.NODE_ENV === 'development',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'localhost',
        port: parseInt(process.env.MAIL_PORT, 10) || 1025,
        secure: false, // Mailhog doesn't use TLS
        auth: process.env.MAIL_USER
          ? {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            }
          : undefined,
      },
      defaults: {
        from: process.env.MAIL_FROM || 'noreply@patientapp.com',
      },
    }),
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

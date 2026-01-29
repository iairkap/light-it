import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientRegisteredListener {
  private emailTemplate: HandlebarsTemplateDelegate;

  constructor(private readonly mailerService: MailerService) {
    // Cargar template desde src (funciona en dev y prod)
    const templatePath = join(
      process.cwd(),
      'src',
      'patients',
      'templates',
      'patient-registered.hbs',
    );
    const templateSource = readFileSync(templatePath, 'utf-8');
    this.emailTemplate = Handlebars.compile(templateSource);
  }

  @OnEvent('patient.registered')
  async handlePatientRegistered(patient: Patient) {
    console.log(`📧 Sending email to: ${patient.email}`);

    try {
      const html = this.emailTemplate({
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.getFullPhoneNumber(),
        registrationDate: new Date(patient.createdAt).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        ),
      });

      await this.mailerService.sendMail({
        to: patient.email,
        subject: '✅ Registration Successful - Welcome!',
        html,
      });

      console.log(`✅ Email sent successfully to ${patient.email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${patient.email}:`, error);
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-email')
  async testEmail() {
    await this.mailerService.sendMail({
      to: 'test@example.com',
      subject: 'Test Email from Patient Registration App',
      text: 'Hello! This is a test email from NestJS + Mailhog.',
      html: '<h1>✅ Email System Working!</h1><p>This confirms that the mailer integration is successful.</p>',
    });

    return {
      message: 'Test email sent! Check Mailhog at http://localhost:8025',
    };
  }
}

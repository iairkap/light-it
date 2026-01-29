import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsGmail } from '../../common/decorators/is-gmail.decorator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'Full name should only contain letters',
  })
  fullName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsGmail()
  email: string;

  @IsNotEmpty({ message: 'Phone country code is required' })
  @IsString()
  @Matches(/^\+\d{1,4}$/, {
    message: 'Country code must be in E.164 format (e.g., +1, +54, +598)',
  })
  phoneCountryCode: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Matches(/^\d{6,15}$/, {
    message:
      'Phone number must contain only digits (6-15 characters, E.164 format)',
  })
  phoneNumber: string;

  // El campo de foto se agregará en el Paso 8 con Multer
  // Por ahora usaremos un placeholder
  documentPhotoUrl?: string;
}

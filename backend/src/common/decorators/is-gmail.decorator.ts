import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsGmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // Basic email format validation (defense in depth)
          // Check for exactly one @ symbol
          const atCount = (value.match(/@/g) || []).length;
          if (atCount !== 1) {
            return false;
          }

          // Validar que termine con @gmail.com (case-insensitive)
          return value.toLowerCase().endsWith('@gmail.com');
        },
        defaultMessage(args: ValidationArguments) {
          return 'Email must be a @gmail.com address';
        },
      },
    });
  };
}

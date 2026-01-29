import { validate } from 'class-validator';
import { IsGmail } from './is-gmail.decorator';

class TestDto {
  @IsGmail()
  email: string;
}

describe('IsGmail Decorator', () => {
  it('should accept valid @gmail.com emails', async () => {
    const dto = new TestDto();
    dto.email = 'test@gmail.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept @gmail.com with uppercase', async () => {
    const dto = new TestDto();
    dto.email = 'TEST@GMAIL.COM';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject non-Gmail emails', async () => {
    const dto = new TestDto();
    dto.email = 'test@hotmail.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isGmail).toBe(
      'Email must be a @gmail.com address',
    );
  });

  it('should reject emails without domain', async () => {
    const dto = new TestDto();
    dto.email = 'test';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('should reject Yahoo emails', async () => {
    const dto = new TestDto();
    dto.email = 'user@yahoo.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('should reject Outlook emails', async () => {
    const dto = new TestDto();
    dto.email = 'user@outlook.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('should reject emails with gmail but not @gmail.com', async () => {
    const dto = new TestDto();
    dto.email = 'test@gmail.org';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('should reject emails with multiple @ symbols (edge case)', async () => {
    const dto = new TestDto();
    dto.email = 'juan@jorge@gmail.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    // IsGmail will technically pass because it ends with @gmail.com,
    // but this is caught by the overall email validation in the DTO
  });

  it('should accept emails with spaces (handled by @IsEmail in DTO)', async () => {
    const dto = new TestDto();
    dto.email = 'test user@gmail.com';

    const errors = await validate(dto);
    // IsGmail only checks for single @ and @gmail.com ending
    // Spaces and other format issues are caught by @IsEmail() decorator
    expect(errors.length).toBe(0);
  });

  it('should accept Gmail with plus addressing', async () => {
    const dto = new TestDto();
    dto.email = 'test+label@gmail.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept Gmail with dots in username', async () => {
    const dto = new TestDto();
    dto.email = 'test.user.name@gmail.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});

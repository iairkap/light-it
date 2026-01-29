import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';

describe('PatientsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.query('TRUNCATE TABLE patients CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/patients (GET)', () => {
    return request(app.getHttpServer())
      .get('/patients')
      .expect(200)
      .then(response => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/patients (POST) - Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/patients')
      .field('fullName', 'Juan Perez')
      .field('email', 'e2e.test@gmail.com')
      .field('phoneCountryCode', '+1')
      .field('phoneNumber', '1234567890')
      .attach('documentPhoto', '/tmp/test-document.jpg');

    if (response.status !== 201) {
      console.log('E2E Failure Body:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(201);
    expect(response.body.fullName).toBe('Juan Perez');
    expect(response.body.email).toBe('e2e.test@gmail.com');
    expect(response.body.documentPhotoUrl).toContain('/uploads/');
  });

  it('/patients (POST) - Invalid Email', () => {
    return request(app.getHttpServer())
      .post('/patients')
      .field('fullName', 'Test User')
      .field('email', 'invalid@hotmail.com')
      .field('phoneCountryCode', '+1')
      .field('phoneNumber', '1234567890')
      .attach('documentPhoto', '/tmp/test-document.jpg')
      .expect(400)
      .then(response => {
        expect(response.body.message).toContain('Email must be a @gmail.com address');
      });
  });

  it('/patients (POST) - No File', () => {
    return request(app.getHttpServer())
      .post('/patients')
      .field('fullName', 'Test User')
      .field('email', 'nofile@gmail.com')
      .field('phoneCountryCode', '+1')
      .field('phoneNumber', '1234567890')
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('Document photo is required');
      });
  });
});

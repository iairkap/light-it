import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Patient } from '../patients/entities/patient.entity';
import { config } from 'dotenv';

// Load environment variables
config();

// simple mock data generator
function generateMockPatients(count: number) {
  const patients = [];
  const givenNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
  const familyNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  for (let i = 0; i < count; i++) {
    const firstName = givenNames[Math.floor(Math.random() * givenNames.length)];
    const lastName = familyNames[Math.floor(Math.random() * familyNames.length)];
    
    patients.push({
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`,
      phoneCountryCode: '+1',
      phoneNumber: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
      documentPhotoUrl: 'placeholder.jpg',
    });
  }
  return patients;
}

async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'patient_app',
    password: process.env.DATABASE_PASSWORD || 'dev_password_change_in_production',
    database: process.env.DATABASE_NAME || 'patient_registration',
    entities: [Patient],
    synchronize: false, // Don't sync schema, just use it
  });

  try {
    await dataSource.initialize();
    console.log('📦 Connected to Database');

    const patientRepo = dataSource.getRepository(Patient);

    // 1. CLEANUP
    console.log('🧹 Cleaning Database...');
    await patientRepo.clear(); // Truncates the table
    console.log('✅ Database Cleared');

    // 2. CLEANUP UPLOADS
    console.log('🧹 Cleaning Uploads Folder...');
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file !== '.gitkeep') {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      }
    } else {
        // Ensure directory exists if missing
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    console.log('✅ Uploads Cleared');

    // 3. SEED (Optional logic, based on args or default empty)
    const shouldSeed = process.argv.includes('--seed');
    
    if (shouldSeed) {
      console.log('🌱 Seeding Mock Data...');
      const mockPatients = generateMockPatients(50);
      const entities = patientRepo.create(mockPatients);
      await patientRepo.save(entities);
      console.log(`✅ Seeded ${mockPatients.length} patients`);
    } else {
      console.log('ℹ️  Skipping seed (use --seed to populate)');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

run();

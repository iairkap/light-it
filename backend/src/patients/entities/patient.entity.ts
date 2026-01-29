import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 5, comment: 'E.164 format, e.g., +598' })
  phoneCountryCode: string;

  @Column({ type: 'varchar', length: 15, comment: 'E.164 format, max 15 digits' })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 500 })
  documentPhotoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Returns the full phone number in E.164 format for SMS services
   * Example: +5491122334455
   */
  getFullPhoneNumber(): string {
    return `${this.phoneCountryCode}${this.phoneNumber}`;
  }
}

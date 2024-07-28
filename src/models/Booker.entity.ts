import { Index, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Booking } from './Booking.entity';

export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'booker',
}

@Entity({ name: 'Booker' })
export class Booker extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, default: 'default-user-avatar.png', nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserRoleType, default: UserRoleType.USER })
  role: UserRoleType;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', default: '' })
  phone: string;

  @OneToMany(() => Booking, (booking) => booking.booker_id)
  bookings: Booking[];
}

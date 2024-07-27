import { Index, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Booking } from './Booking.entity';

@Entity({ name: 'Movie' })
export class Movie extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  director: string;

  @OneToMany(() => Booking, (booking) => booking.auditorium)
  bookings: Booking[];
}

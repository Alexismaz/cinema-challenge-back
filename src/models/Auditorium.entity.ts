import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Booking } from './Booking.entity';
import { Seat } from './Seat.entity';

@Entity({ name: 'Auditorium' })
export class Auditorium extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'number', nullable: false, default: 20 })
  sear_count: number;

  @OneToMany(() => Seat, (seat) => seat.auditorium)
  seats: Seat[];

  @OneToMany(() => Booking, (booking) => booking.auditorium)
  bookings: Booking[];
}

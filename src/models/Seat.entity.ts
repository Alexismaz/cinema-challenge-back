import { Index, Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Auditorium } from './Auditorium.entity';
import { Booking } from './Booking.entity';

@Entity({ name: 'Seat' })
export class Seat extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'number', nullable: false })
  seat_number: number;

  @OneToMany(() => Booking, (booking) => booking.seat)
  bookings: Booking;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.seats)
  auditorium: Auditorium;
}

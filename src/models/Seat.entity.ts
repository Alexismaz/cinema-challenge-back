import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Auditorium } from './Auditorium.entity';
import { Booking } from './Booking.entity';

@Entity({ name: 'Seat' })
export class Seat extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  seat_number: number;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.seats)
  auditorium: Auditorium;

  @OneToMany(() => Booking, (booking) => booking.seat)
  bookings: Booking[];
}

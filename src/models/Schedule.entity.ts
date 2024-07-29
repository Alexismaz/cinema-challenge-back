import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Auditorium } from './Auditorium.entity';
import { Booking } from './Booking.entity';

@Entity({ name: 'Schedule' })
export class Schedule extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  hour: string;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.schedules)
  auditorium: Auditorium;

  @OneToMany(() => Booking, (booking) => booking.schedule)
  bookings: Booking[];
}

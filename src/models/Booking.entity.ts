import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Auditorium } from './Auditorium.entity';
import { Booker } from './Booker.entity';
import { Seat } from './Seat.entity';
import { Movie } from './Movie.entity';

@Entity({ name: 'Booking' })
export class Booking extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.bookings)
  auditorium: Auditorium;

  @ManyToOne(() => Booker, (booker) => booker.bookings)
  booker: Booker;

  @ManyToOne(() => Seat, (seat) => seat.bookings)
  seat: Seat;

  @ManyToOne(() => Movie, (movie) => movie.bookings)
  movie: Movie;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  disponibility: boolean;
}

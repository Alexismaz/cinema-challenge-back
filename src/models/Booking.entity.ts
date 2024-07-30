import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Booker } from './Booker.entity';
import { Seat } from './Seat.entity';
import { Movie } from './Movie.entity';
import { Schedule } from './Schedule.entity';

@Entity({ name: 'Booking' })
export class Booking extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Booker, (booker) => booker.bookings)
  booker: Booker;

  @ManyToOne(() => Schedule, (schedule) => schedule.bookings)
  schedule: Schedule;

  @ManyToOne(() => Seat, (seat) => seat.bookings)
  seat: Seat;

  @ManyToOne(() => Movie, (movie) => movie.bookings)
  movie: Movie;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  reservation_code: string;
}

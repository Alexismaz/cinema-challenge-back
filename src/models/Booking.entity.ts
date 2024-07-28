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

  @ManyToOne(() => Booker, (booker) => booker.id)
  booker_id: number;

  @ManyToOne(() => Seat, (seat) => seat.id)
  seat_id: number;

  @ManyToOne(() => Movie, (movie) => movie.id)
  movie_id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.id)
  schedule_id: number;

  @Column({ type: 'boolean', default: true })
  disponibility: boolean;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  reservation_code: string;
}

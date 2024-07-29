import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Seat } from './Seat.entity';
import { Schedule } from './Schedule.entity';

@Entity({ name: 'Auditorium' })
export class Auditorium extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false, default: 20 })
  seat_count: number;

  @OneToMany(() => Seat, (seat) => seat.auditorium)
  seats: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.auditorium)
  schedules: Schedule[];
}

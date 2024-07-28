import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Seat } from './Seat.entity';

@Entity({ name: 'Auditorium' })
export class Auditorium extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false, default: 20 })
  seat_count: number;

  @ManyToMany(() => Seat, (seat) => seat.auditoriums)
  @JoinTable()
  seats: Seat[];
}

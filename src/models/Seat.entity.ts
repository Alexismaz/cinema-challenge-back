import { Index, Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Auditorium } from './Auditorium.entity';

@Entity({ name: 'Seat' })
export class Seat extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'int', nullable: false })
  seat_number: number;

  @ManyToMany(() => Auditorium, (auditorium) => auditorium.seats)
  auditoriums: Auditorium[];
}

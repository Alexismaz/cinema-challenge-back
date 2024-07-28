import { Index, Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'Schedule' })
export class Schedule extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  hour: string;
}

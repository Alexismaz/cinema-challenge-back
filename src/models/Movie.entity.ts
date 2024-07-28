import { Index, Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'Movie' })
export class Movie extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  director: string;
}

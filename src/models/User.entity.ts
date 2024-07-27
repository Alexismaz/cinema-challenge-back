import { Index, Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, default: 'default-user-avatar.png', nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserRoleType, default: UserRoleType.USER })
  role: UserRoleType;

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', default: '' })
  phone: string;
}

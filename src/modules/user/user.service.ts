import { Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRoleType } from '@models/User.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }
    return user;
  }

  async userExistByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.userRepository.createQueryBuilder('user').select('user.password').where('user.email = :email', { email }).getRawOne();

    if (user) return user.user_password;

    return null;
  }

  async updateLastLogin(user: User): Promise<User> {
    user.last_login = new Date();
    return this.userRepository.save(user);
  }

  async changeAvatar(userId: number, avatar: string): Promise<User> {
    const user = await this.findById(userId);
    user.avatar = avatar;
    return this.userRepository.save(user);
  }

  async findUserDataById(userId: number): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = new User();
    newUser.email = user.email as string;
    newUser.password = hashedPassword;
    newUser.role = user.role as UserRoleType;
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }
}

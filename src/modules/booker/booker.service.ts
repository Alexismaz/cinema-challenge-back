import { Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booker, UserRoleType } from '@models/Booker.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Booking } from '@models/Booking.entity';

@Injectable()
export class BookerService {
  private readonly logger = new Logger(BookerService.name);

  constructor(
    @InjectRepository(Booker)
    private readonly bookerRepository: Repository<Booker>,
    private readonly configService: ConfigService,
  ) {}

  async save(booker: Booker): Promise<Booker> {
    return this.bookerRepository.save(booker);
  }

  async findById(bookerId: number): Promise<Booker> {
    const booker = await this.bookerRepository.findOne({
      where: { id: bookerId },
    });
    if (!booker) {
      throw new NotFoundException('El usuario no existe.');
    }
    return booker;
  }

  async bookerExistByEmail(email: string): Promise<Booker | null> {
    const booker = await this.bookerRepository.findOne({ where: { email: email } });
    return booker;
  }

  async findByEmailWithPassword(email: string): Promise<Booker | null> {
    const booker = await this.bookerRepository.createQueryBuilder('booker').select('booker.password').where('booker.email = :email', { email }).getRawOne();

    if (booker) return booker.booker_password;

    return null;
  }

  async changeAvatar(bookerId: number, avatar: string): Promise<Booker> {
    const booker = await this.findById(bookerId);
    booker.avatar = avatar;
    return this.bookerRepository.save(booker);
  }

  async findBookerDataById(bookerId: number): Promise<Booker | null> {
    const booker = await this.findById(bookerId);
    if (!booker) {
      return null;
    }
    return booker;
  }

  async createBooker(booker: Partial<Booker>): Promise<Booker> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(booker.password, salt);

    const newBooker = new Booker();
    newBooker.email = booker.email as string;
    newBooker.password = hashedPassword;
    newBooker.role = booker.role as UserRoleType;
    const savedBooker = await this.bookerRepository.save(newBooker);
    return savedBooker;
  }

  async getBookerById(bookerId: number): Promise<Booking[]> {
    const bookingsFound = await this.bookerRepository.findOne({
      where: {
        id: bookerId,
      },
      relations: ['booking'],
    });
    if (!bookingsFound) throw new NotFoundException('[ Booker | Bookings ]: No se econtraron bookings');

    return bookingsFound.bookings;
  }
}

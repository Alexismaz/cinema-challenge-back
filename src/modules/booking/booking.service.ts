import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '@models/Booking.entity';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}
  async checkDisponibility() {
    const disponibility = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.seat_id', 'seat')
      .leftJoinAndSelect('booking.schedule_id', 'schedule')
      .getMany();
    return disponibility;
  }
}

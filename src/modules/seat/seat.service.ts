import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from '@models/Seat.entity';
import { Auditorium } from '@models/Auditorium.entity';

@Injectable()
export class SeatService {
  private readonly logger = new Logger(SeatService.name);

  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}
  async createSeats(seat_count: number, auditorium: Auditorium) {
    for (let i = 1; i <= seat_count; i++) {
      const seat = new Seat();
      seat.seat_number = i;
      seat.auditorium = auditorium;
      await this.seatRepository.save(seat);
    }
  }

  async getSeatById(seatNumber: number, auditoriumId: number) {
    const seat = await this.seatRepository.findOne({
      where: {
        seat_number: seatNumber,
        auditorium: {
          id: auditoriumId,
        },
      },
      relations: ['auditorium'],
    });
    return seat;
  }
}

import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auditorium } from '@models/Auditorium.entity';

@Injectable()
export class AuditoriumService {
  private readonly logger = new Logger(AuditoriumService.name);

  constructor(
    @InjectRepository(Auditorium)
    private readonly auditoriumRepository: Repository<Auditorium>,
  ) {}

  async getAuditoriums() {
    const allAuditoriums = await this.auditoriumRepository.find({
      relations: ['seats', 'schedules'],
    });

    return allAuditoriums;
  }

  async createAuditorium(auditorium: Auditorium) {
    const newAuditorium = new Auditorium();
    newAuditorium.name = auditorium.name;
    newAuditorium.seat_count = auditorium.seat_count;
    await this.auditoriumRepository.save(newAuditorium);

    return newAuditorium;
  }
}

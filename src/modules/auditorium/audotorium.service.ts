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
      relations: ['seats'],
    });

    return allAuditoriums;
  }
}

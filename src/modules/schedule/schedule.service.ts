import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '@models/Schedule.entity';
import { Auditorium } from '@models/Auditorium.entity';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}
  async getAllSchedules() {
    const allSchedules = await this.scheduleRepository.find();
    return allSchedules;
  }

  async getScheduleById(hour: string, auditoriumId: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        hour: hour,
        auditorium: { id: auditoriumId },
      },
      relations: ['auditorium'],
    });
    return schedule;
  }

  async createSchedules(scheduleHour: string, auditorium: Auditorium) {
    const newSchedule = new Schedule();
    newSchedule.hour = scheduleHour;
    newSchedule.auditorium = auditorium;
    await this.scheduleRepository.save(newSchedule);
    return newSchedule;
  }
}

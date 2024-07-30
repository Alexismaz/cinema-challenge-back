import { Injectable, Logger } from '@nestjs/common';
import { BookerService } from '../modules/booker/booker.service';
import { UserRoleType } from '@models/Booker.entity';
import { AuditoriumService } from '@modules/auditorium/audotorium.service';
import { SeatService } from '@modules/seat/seat.service';
import { ScheduleService } from '@modules/schedule/schedule.service';
import { MovieService } from '@modules/movie/movie.service';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);
  constructor(
    private readonly bookerService: BookerService,
    private readonly auditoriumService: AuditoriumService,
    private readonly seatService: SeatService,
    private readonly schedulesService: ScheduleService,
    private readonly movieService: MovieService,
  ) {}

  async loadDataByDefault(): Promise<void> {
    const defaultBookers = [
      {
        email: 'alexisfajian@gmail.com',
        password: '123456',
        role: UserRoleType.ADMIN,
      },
    ];
    const movie = await this.movieService.getMovieById(1);
    this.logger.debug('Creating Movie if they do not already exist');
    if (!movie) {
      await this.movieService.createDefault();
    }
    const auditoriums = await this.auditoriumService.getAuditoriums();
    this.logger.debug('Creating auditoriums if they do not already exist');
    if (auditoriums.length === 0) {
      const auditoriumsDefault = [
        { id: 1, name: 'Sala A', seat_count: 20, seats: [], schedules: [] },
        { id: 2, name: 'Sala B', seat_count: 20, seats: [], schedules: [] },
        { id: 3, name: 'Sala C', seat_count: 30, seats: [], schedules: [] },
      ];
      for (const auditoriumDefault of auditoriumsDefault) {
        await this.auditoriumService.createAuditorium(auditoriumDefault);
      }
    }
    this.logger.debug('Creating seats for auditoriums if they do not already exist');
    auditoriums.forEach(async (auditorium) => {
      if (auditorium.seats.length === 0) {
        await this.seatService.createSeats(auditorium.seat_count, auditorium);
      }
      if (auditorium.schedules.length === 0) {
        const schedulesDefault = ['1500', '1700', '1900'];
        for (const scheduleDefault of schedulesDefault) {
          await this.schedulesService.createSchedules(scheduleDefault, auditorium);
        }
      }
    });

    for (const booker of defaultBookers) {
      this.logger.debug(`creating default booker ${booker.email} if it does not exist`);
      const userExists = await this.bookerService.bookerExistByEmail(booker.email);

      if (!userExists) {
        await this.bookerService.createBooker(booker);
      }
    }
  }
}

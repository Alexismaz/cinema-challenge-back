import { Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '@models/Booking.entity';
import { AuditoriumService } from '@modules/auditorium/audotorium.service';
import { Booker } from '@models/Booker.entity';
import { MovieService } from '@modules/movie/movie.service';
import { BookingCreateDto } from './dto/booking-create.dto';
import { SeatService } from '@modules/seat/seat.service';
import { ScheduleService } from '@modules/schedule/schedule.service';

class DisponibilityProps {
  name: string;
  auditorium_id: number;
  three: boolean;
  five: boolean;
  seven: boolean;
}

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly auditoriumService: AuditoriumService,
    private readonly movieService: MovieService,
    private readonly seatService: SeatService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async checkDisponibility() {
    const allDisponibility: DisponibilityProps[] = [];
    const allAuditoriums = await this.auditoriumService.getAuditoriums();
    const bookings = await this.bookingRepository.find({
      relations: ['schedule', 'schedule.auditorium'],
    });
    allAuditoriums.map((auditorium) => {
      const auditoriumBookings = bookings.filter((booking) => booking.schedule.auditorium.id === auditorium.id);
      const auditoriumDisponibility = {
        name: auditorium.name,
        auditorium_id: auditorium.id,
        three: auditoriumBookings.filter((booking) => booking.schedule.hour === '1500').length < auditorium.seat_count,
        five: auditoriumBookings.filter((booking) => booking.schedule.hour === '1700').length < auditorium.seat_count,
        seven: auditoriumBookings.filter((booking) => booking.schedule.hour === '1900').length < auditorium.seat_count,
      };
      allDisponibility.push(auditoriumDisponibility);
    });
    return allDisponibility;
  }

  async createBooking(booking: BookingCreateDto, booker: Booker) {
    const movieFound = await this.movieService.getMovieById(booking.movie_id);
    if (!movieFound) throw new NotFoundException('[ Booking | Create ]: No se encontro la pelicula');
    const seatFound = await this.seatService.getSeatById(booking.seat_number, booking.auditorium_id);
    if (!seatFound) throw new NotFoundException('[ Booking | Create ]: No se encontro el asiento');
    const scheduleFound = await this.scheduleService.getScheduleById(booking.hour, booking.auditorium_id);
    if (!scheduleFound) throw new NotFoundException('[ Booking | Create ]: No se encontro el horario');
    const newBooking = new Booking();
    newBooking.movie = movieFound;
    newBooking.seat = seatFound;
    newBooking.schedule = scheduleFound;
    newBooking.booker = booker;
    await this.bookingRepository.save(newBooking);

    return newBooking;
  }

  async createOrder(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: id,
      },
      relations: ['schedule', 'seat', 'booker', 'movie', 'seat.auditorium'],
    });
    if (!booking) throw new NotFoundException('[ Booking | CreateOrder ]: no se encontro el booking');
    booking.seat.disponibility = false;
    booking.reservation_code = 'A15sdgas65aUENSo';
    await this.bookingRepository.save(booking);
    const formatedBooking = {
      email: booking.booker.email,
      reservation_code: booking.reservation_code,
      auditorium: booking.seat.auditorium.name,
      hour: booking.schedule.hour,
      seat_number: booking.seat.seat_number,
    };
    console.log(booking, formatedBooking);
    return formatedBooking;
  }
}

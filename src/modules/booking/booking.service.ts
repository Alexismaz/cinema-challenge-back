import { Repository } from 'typeorm';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '@models/Booking.entity';
import { AuditoriumService } from '@modules/auditorium/audotorium.service';
import { Booker } from '@models/Booker.entity';
import { MovieService } from '@modules/movie/movie.service';
import { BookingCreateDto } from './dto/booking-create.dto';
import { SeatService } from '@modules/seat/seat.service';
import { ScheduleService } from '@modules/schedule/schedule.service';
import { MercadoPagoConfig, Preference, Payment as MercadoPagoPayment } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

class DisponibilityProps {
  name: string;
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

  async createOrder(id: number, bookerId: number) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: id,
      },
      relations: ['auditorium'],
    });
    if (!booking) {
      throw new Error('booking no encontrado');
    }
    const actualDay = new Date();
    const client = new MercadoPagoConfig({
      accessToken: String(process.env.MP_TOKEN),
      options: { timeout: 5000, idempotencyKey: 'abc' },
    });
    const preferencer = new Preference(client);
    const mpId = uuidv4();
    const items = [
      {
        id: mpId,
        title: `Reserva de sala ${booking}`,
        description: `Fecha ${actualDay.getFullYear()}-${actualDay.getMonth() - 1}-${actualDay.getDate()} ${booking.schedule.hour}hs`,
        unit_price: 500,
        quantity: 1,
        currency_id: 'ARS',
      },
    ];
    const result = await preferencer.create({
      body: {
        items: items,
        notification_url: `https://9ae2-2800-810-804-e2-7d92-f629-e6a3-532.ngrok-free.app/api/booking/webhook/${booking.id}/${bookerId}`,
        metadata: {
          booking_id: booking.id,
          booker_id: bookerId,
        },
        auto_return: 'approved',
        back_urls: {
          success: `https://padelink.com.ar/payment/success/${booking.id}`,
          failure: 'https://padelink.com.ar/payment/failure',
          pending: 'https://padelink.com.ar/payment/pending',
        },
      },
    });
    return result.init_point;
  }

  async receiveWebhook(type: string, id: string, bookingId: number) {
    try {
      if (type === 'payment') {
        const booking = await this.bookingRepository.findOne({
          where: {
            id: bookingId,
          },
          relations: ['schedule', 'seat'],
        });
        if (!booking) {
          throw new Error('Booking no encontrado');
        }

        if (!booking.disponibility) {
          throw new Error('El booking ya fue pagado');
        }

        const client = new MercadoPagoConfig({
          accessToken: String(process.env.MP_TOKEN),
          options: { timeout: 5000, idempotencyKey: 'abc' },
        });

        const mercadoPagoPayment = new MercadoPagoPayment(client);
        const data = await mercadoPagoPayment.get({ id: id });
        if (!data) return null;

        if (data.status === 'approved') {
          booking.disponibility = false;
          booking.reservation_code = id;
          await this.bookingRepository.save(booking);
          return {
            status: data.status,
            message: 'the payment was made successfully',
          };
        } else new BadRequestException('there was an error in the payment');
      }
    } catch (error) {
      throw error;
    }
  }
}

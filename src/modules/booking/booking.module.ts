import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from '@models/Booking.entity';
import { ScheduleService } from '@modules/schedule/schedule.service';
import { Schedule } from '@models/Schedule.entity';
import { Auditorium } from '@models/Auditorium.entity';
import { AuditoriumService } from '@modules/auditorium/audotorium.service';
import { BookerService } from '@modules/booker/booker.service';
import { Booker } from '@models/Booker.entity';
import { MovieService } from '@modules/movie/movie.service';
import { Movie } from '@models/Movie.entity';
import { SeatService } from '@modules/seat/seat.service';
import { Seat } from '@models/Seat.entity';

@Module({
  providers: [BookingService, MovieService, ScheduleService, BookerService, SeatService, AuditoriumService, AuthService, JwtService],
  controllers: [BookingController],
  imports: [TypeOrmModule.forFeature([Booking, Schedule, Booker, Movie, Seat, Auditorium]), AuthModule],
  exports: [BookingService],
})
export class BookingModule {}
export { BookingService };

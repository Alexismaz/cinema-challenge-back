import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from '@models/Booking.entity';

@Module({
  providers: [BookingService, AuthService, JwtService],
  controllers: [BookingController],
  imports: [TypeOrmModule.forFeature([Booking]), AuthModule],
  exports: [BookingService],
})
export class BookingModule {}
export { BookingService };

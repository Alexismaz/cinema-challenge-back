import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { Seat } from '@models/Seat.entity';
import { Booker } from '@models/Booker.entity';
import { BookerService } from '@modules/booker/booker.service';
@Module({
  providers: [SeatService, AuthService, BookerService, JwtService],
  controllers: [SeatController],
  imports: [TypeOrmModule.forFeature([Seat, Booker]), AuthModule],
  exports: [SeatService],
})
export class SeatModule {}
export { SeatService };

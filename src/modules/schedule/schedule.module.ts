import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Schedule } from '@models/Schedule.entity';
import { Booker } from '@models/Booker.entity';
import { BookerService } from '@modules/booker/booker.service';

@Module({
  providers: [ScheduleService, BookerService, AuthService, JwtService],
  controllers: [ScheduleController],
  imports: [TypeOrmModule.forFeature([Schedule, Booker]), AuthModule],
  exports: [ScheduleService],
})
export class ScheduleModule {}
export { ScheduleService };

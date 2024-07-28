import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuditoriumService } from './audotorium.service';
import { Auditorium } from '@models/Auditorium.entity';
import { AuditoriumController } from './auditorium.controller';
import { BookerService } from '@modules/booker/booker.service';
import { Booker } from '@models/Booker.entity';

@Module({
  providers: [AuditoriumService, BookerService, AuthService, JwtService],
  controllers: [AuditoriumController],
  imports: [TypeOrmModule.forFeature([Auditorium, Booker]), AuthModule],
  exports: [AuditoriumService],
})
export class AuditoriumModule {}

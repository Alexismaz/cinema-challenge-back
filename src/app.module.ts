import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { join } from 'path';
import { AppService } from './app.service';
import { DataService } from './scripts/DataService';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModuleOptions } from './config/options';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookerModule } from '@modules/booker/booker.module';
import { AuditoriumModule } from '@modules/auditorium/auditorium.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ScheduleModule } from '@modules/schedule/schedule.module';
import { SeatModule } from '@modules/seat/seat.module';
import { BookingModule } from '@modules/booking/booking.module';
import { MovieModule } from '@modules/movie/movier.module';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'avatar'),
      serveRoot: '/avatar',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number | undefined>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
        force: true,
      }),
    }),
    AuditoriumModule,
    ScheduleModule,
    BookerModule,
    MovieModule,
    BookingModule,
    SeatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataService],
})
export class AppModule {}

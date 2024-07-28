import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BookerModule } from '../booker/booker.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Booker } from '../../models/Booker.entity';
import { BookerService } from '@modules/booker/booker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booker]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('session.secret'),
        signOptions: {
          expiresIn: config.get<string>('session.expiresIn'),
        },
      }),
    }),
    forwardRef(() => BookerModule),
  ],
  providers: [BookerService, AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}

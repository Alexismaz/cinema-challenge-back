import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booker } from '../../models/Booker.entity';
import { BookerService } from './booker.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BookerController } from './booker.controller';

@Module({
  providers: [BookerService, AuthService, JwtService],
  controllers: [BookerController],
  imports: [
    TypeOrmModule.forFeature([Booker]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('access_token.secret'),
        signOptions: {
          expiresIn: config.get<string>('access_token.expiresIn'),
        },
      }),
    }),
    forwardRef(() => AuthModule),
  ],
  exports: [BookerService],
})
export class BookerModule {}
export { BookerService };

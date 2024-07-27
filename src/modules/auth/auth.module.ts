import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../models/User.entity';
import { UserService } from '@modules/user/user.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('session.secret'),
        signOptions: {
          expiresIn: config.get<string>('session.expiresIn'),
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, AuthService],
  controllers: [AuthController],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}

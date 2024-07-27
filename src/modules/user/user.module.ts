import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User.entity';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User]),
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
  exports: [UserService],
})
export class UserModule {}

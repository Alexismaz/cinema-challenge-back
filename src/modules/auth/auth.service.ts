import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  userRepository: any;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(logInDto: LogInDto) {
    const user = await this.userService.userExistByEmail(logInDto.email);

    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }

    const userPassword = await this.userService.findByEmailWithPassword(logInDto.email);

    if (!bcrypt.compareSync(logInDto.password, userPassword)) {
      throw new UnauthorizedException('Contraseña no válida.');
    }

    await this.userService.updateLastLogin(user);

    const token = await this.generateAccessToken(user.id);

    return {
      ok: true,
      token,
    };
  }

  async generateAccessToken(userId: number): Promise<string> {
    const payload = { userId: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('session.secretKey'),
      expiresIn: this.configService.get<string>('session.jwtTokenExpiration'),
    });

    return accessToken;
  }

  async validateAccessToken(accessToken) {
    try {
      const data = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('session.secretKey'),
      });

      return data;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha caducado');
      }
      return null;
    }
  }
}

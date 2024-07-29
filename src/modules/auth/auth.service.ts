import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { BookerService } from '../booker/booker.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  userRepository: any;

  constructor(
    private readonly bookerService: BookerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(logInDto: LogInDto) {
    const user = await this.bookerService.bookerExistByEmail(logInDto.email);

    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }

    const userPassword = await this.bookerService.findByEmailWithPassword(logInDto.email);

    if (!bcrypt.compareSync(logInDto.password, userPassword)) {
      throw new UnauthorizedException('Contraseña no válida.');
    }
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
      const user = await this.bookerService.findById(data.userId);
      return user;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha caducado');
      }
      return null;
    }
  }
}

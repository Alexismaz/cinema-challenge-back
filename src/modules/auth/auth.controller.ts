import { Public } from '@infrastructure/decorators/public-route.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({ type: LogInDto })
  @ApiOperation({ summary: 'Logea el user con email y password' })
  @Post('/log-in')
  async logIn(@Body() logInDto: LogInDto) {
    const userResponse = await this.authService.logIn(logInDto);
    return userResponse;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const accessToken = authorization.replace(/bearer/gim, '').trim();
      const { user } = await this.authService.validateAccessToken(accessToken);
      request.user = user;
      return true;
    } catch (error) {
      throw new ForbiddenException(error.message || 'session expired! Please sign In');
    }
  }
}

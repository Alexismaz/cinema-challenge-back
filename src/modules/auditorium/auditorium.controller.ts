import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditoriumService } from './audotorium.service';
// import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('auditorium')
@ApiTags('auditorium')
export class AuditoriumController {
  constructor(private readonly auditoriumService: AuditoriumService) {}

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Trae todas las salas' })
  @Get('all-auditoriums')
  async getAllAuditoriums() {
    const result = await this.auditoriumService.getAuditoriums();
    return { ok: true, auditoriums: result };
  }
}

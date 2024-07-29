import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
@ApiTags('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Trae todos los horarios' })
  @Get('all-schedules')
  async getAllSchedules() {
    const result = await this.scheduleService.getAllSchedules();
    return { ok: true, schedules: result };
  }
}

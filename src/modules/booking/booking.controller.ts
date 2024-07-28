import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { BookingService } from './booking.service';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ver disponibilidad de salas y y horarios' })
  @Get('disponibility')
  async checkDisponibility() {
    const result = await this.bookingService.checkDisponibility();
    return { ok: true, events: result };
  }
}

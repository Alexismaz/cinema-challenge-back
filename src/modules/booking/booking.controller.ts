import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { Booker } from '@models/Booker.entity';
import { BookingCreateDto } from './dto/booking-create.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Ver disponibilidad de salas y y horarios' })
  @Get('disponibility')
  async checkDisponibility() {
    const result = await this.bookingService.checkDisponibility();
    return { ok: true, disponibility: result };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo booking' })
  @Post('create')
  async createBooking(@Body() booking: BookingCreateDto, @GetUser() booker: Booker) {
    const result = await this.bookingService.createBooking(booking, booker);
    return { ok: true, newBooking: result };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Va a ser el que simula confirmar el pago' })
  @Put('link-pay/:id')
  async generatePaymentLink(@Param('id') id: number) {
    const result = await this.bookingService.createOrder(id);
    return { ok: true, mp: result };
  }
}

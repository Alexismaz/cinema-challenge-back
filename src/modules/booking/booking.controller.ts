import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
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
  async createBooking(@Body() booking: BookingCreateDto, @GetUser() user: Booker) {
    const result = await this.bookingService.createBooking(booking, user);
    return { ok: true, disponibility: result };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'generar link de pago de evento' })
  @Get('link-pay/:id')
  async generatePaymentLink(@Param('id') id: number, @GetUser() booker: Booker) {
    const bookerId = parseInt(`${booker.id}`, 10);
    const result = await this.bookingService.createOrder(id, bookerId);
    return { ok: true, mp: result };
  }

  @ApiOperation({ summary: 'Recibe la informacion de mercado pago y asigna' })
  @ApiExcludeEndpoint(true)
  @Post('webhook/:eventId/:userId')
  async receiveWebhook(@Param('eventId') eventId: number, @Param('userId') userId: number, @Query('type') type: string, @Query('data.id') id: string) {
    try {
      const response = await this.bookingService.receiveWebhook(type, id, eventId);
      return response;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (error instanceof ConflictException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
        throw new BadRequestException('Something bad happened', {
          cause: error,
        });
      }
    }
  }
}

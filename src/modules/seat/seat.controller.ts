import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { SeatService } from './seat.service';

@Controller('seat')
@ApiTags('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}
}

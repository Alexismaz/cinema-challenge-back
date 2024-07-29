import { Controller, Get, Put, UploadedFile, UseInterceptors, UseGuards, HttpException, HttpStatus, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { BookerService } from './booker.service';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { Booker } from '@models/Booker.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('booker')
@ApiTags('booker')
export class BookerController {
  constructor(private readonly bookerService: BookerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene tu datos de usuario' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetUser() booker: Booker) {
    return { ok: true, booker };
  }

  @UseGuards(JwtAuthGuard)
  @Put('avatar')
  @ApiOperation({ summary: 'Edita tu avatar de usuario' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!allowedFileExtensions.includes(file.originalname.split('.').pop() ?? '')) {
          return callback(new UnsupportedMediaTypeException(), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/avatar/',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuid.v4();
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffix}.${extension}`;
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @GetUser() booker: Booker,
  ) {
    if (!file) throw new HttpException('a file is required', HttpStatus.BAD_REQUEST);

    const bookerId = parseInt(`${booker.id}`, 10);
    const avatar = file.filename;
    const bookersaved = await this.bookerService.changeAvatar(bookerId, avatar);

    return { ok: true, user: bookersaved };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Trae todos los bookings del usuario' })
  @ApiBearerAuth()
  @Get('bookings')
  async getUserBookings(@GetUser() booker: Booker) {
    const bookerId = parseInt(`${booker.id}`, 10);
    const userBookings = await this.bookerService.getBookerById(bookerId);
    return { ok: true, bookings: userBookings };
  }
}

import { Controller, Get, Put, UploadedFile, UseInterceptors, UseGuards, HttpException, HttpStatus, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { UserService } from './user.service';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene tu datos de usuario' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetUser() user: User) {
    return { ok: true, user };
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
    @GetUser() user: User,
  ) {
    if (!file) throw new HttpException('a file is required', HttpStatus.BAD_REQUEST);

    const userId = parseInt(`${user.id}`, 10);
    const avatar = file.filename;
    const usersaved = await this.userService.changeAvatar(userId, avatar);

    return { ok: true, user: usersaved };
  }
}

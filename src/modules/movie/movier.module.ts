import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Booker } from '@models/Booker.entity';
import { BookerService } from '@modules/booker/booker.service';
import { Movie } from '@models/Movie.entity';

@Module({
  providers: [MovieService, BookerService, AuthService, JwtService],
  controllers: [MovieController],
  imports: [TypeOrmModule.forFeature([Movie, Booker]), AuthModule],
  exports: [MovieService],
})
export class MovieModule {}
export { MovieService };

import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { MovieService } from './movie.service';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Trae todos los horarios' })
  @Get('get-movie/:id')
  async getMovieById(@Param('id') id: number) {
    const result = await this.movieService.getMovieById(id);
    return { ok: true, movie: result };
  }
}

import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '@models/Movie.entity';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  async getMovieById(movieId: number) {
    const movieFounded = await this.movieRepository.findOne({ where: { id: movieId } });
    return movieFounded;
  }

  async createDefault() {
    const newMovie = new Movie();
    newMovie.title = 'DeadPool';
    newMovie.description = 'Muy buena pelicula la recomiendo mucho';
    newMovie.director = 'Shawn Levy​';
    await this.movieRepository.save(newMovie);
    return newMovie;
  }
}

import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookingCreateDto {
  @ApiProperty({ example: '1500', description: 'Horario formato militar' })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un horario formato militar ' })
  hour: string;

  @ApiProperty({ example: '14', description: 'Numero de asiento' })
  @IsInt()
  @IsNotEmpty({ message: 'Introduce un numero de asiento ' })
  seat_number: number;

  @ApiProperty({ example: '5', description: 'Un id de alguna pelicula' })
  @IsInt()
  @IsNotEmpty({ message: 'Introduce un id de una pelicula ' })
  movie_id: number;

  @ApiProperty({ example: '8', description: 'Un id de alguna sala' })
  @IsInt()
  @IsNotEmpty({ message: 'Introduce un id de una sala' })
  auditorium_id: number;
}

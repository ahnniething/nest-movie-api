import { Controller, Get } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
  //http://localhost:3000/movies/
  @Get()
  getAll() {
    return 'This will return all movies';
  }
}

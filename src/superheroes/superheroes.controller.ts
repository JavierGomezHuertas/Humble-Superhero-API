import { Body, Controller, Get, Post } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { CreateSuperheroDto } from './create-superhero.dto';
import { Superhero } from './superheroes.entity';

@Controller('superheroes')
export class SuperheroesController {
  constructor(private readonly superheroesService: SuperheroesService) {}

  @Post()
  async create(
    @Body() createSuperheroDto: CreateSuperheroDto,
  ): Promise<Superhero> {
    return this.superheroesService.create(createSuperheroDto);
  }

  @Get()
  async findAll(): Promise<Superhero[]> {
    return this.superheroesService.findAll();
  }
}

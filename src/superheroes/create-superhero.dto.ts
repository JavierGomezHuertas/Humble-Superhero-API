import { Superhero } from './superheroes.entity';
import { OmitType } from '@nestjs/swagger';

export class CreateSuperheroDto extends OmitType(Superhero, ['id'] as const) {}

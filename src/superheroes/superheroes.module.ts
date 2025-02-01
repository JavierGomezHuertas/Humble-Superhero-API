import { Module } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { SuperheroesController } from './superheroes.controller';
import { RedisModule } from '../redis.module';

@Module({
  imports: [RedisModule],
  controllers: [SuperheroesController],
  providers: [SuperheroesService],
  exports: [SuperheroesService],
})
export class SuperheroesModule {}

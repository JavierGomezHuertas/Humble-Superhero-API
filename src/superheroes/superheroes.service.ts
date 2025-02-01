import { Injectable, Inject } from '@nestjs/common';
import { CreateSuperheroDto } from './create-superhero.dto';
import { Superhero } from './superheroes.entity';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis';

@Injectable()
export class SuperheroesService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async create(superheroDto: CreateSuperheroDto): Promise<Superhero> {
    const id = uuidv4();
    const superhero: Superhero = { ...superheroDto, id };

    const redisData: Record<string, string> = {
      name: superhero.name,
      superpower: superhero.superpower,
      humilityScore: superhero.humilityScore.toString(),
    };

    await this.redisClient.hSet(`superhero:${id}`, redisData);

    const savedData = await this.redisClient.hGetAll(`superhero:${id}`);
    console.log('Datos guardados en Redis:', savedData);

    const zAddData: { score: number; value: string } = {
      value: id,
      score: superhero.humilityScore,
    };

    await this.redisClient.zAdd('superheroes:scores', zAddData);

    return superhero;
  }

  async findAll(): Promise<Superhero[]> {
    try {
      const rawData = await this.redisClient.sendCommand<string[]>([
        'ZREVRANGE',
        'superheroes:scores',
        '0',
        '-1',
        'WITHSCORES',
      ]);

      if (!Array.isArray(rawData)) {
        throw new Error('Respuesta inesperada de Redis');
      }

      const idScorePairs: Array<{ id: string; score: number }> = [];
      for (let i = 0; i < rawData.length; i += 2) {
        if (
          typeof rawData[i] === 'string' &&
          typeof rawData[i + 1] === 'string'
        ) {
          const id = rawData[i];
          const score = parseInt(rawData[i + 1], 10);
          if (!isNaN(score)) {
            idScorePairs.push({ id, score });
          }
        }
      }

      const heroes: Superhero[] = [];

      for (const { id } of idScorePairs) {
        const data = await this.redisClient.hGetAll(`superhero:${id}`);

        if (
          typeof data.name === 'string' &&
          typeof data.superpower === 'string' &&
          typeof data.humilityScore === 'string'
        ) {
          const humilityScore = parseInt(data.humilityScore, 10);
          if (!isNaN(humilityScore)) {
            heroes.push({
              id,
              name: data.name,
              superpower: data.superpower,
              humilityScore,
            });
          }
        } else {
          console.warn(`Superhéroe ${id} tiene datos incompletos, omitiendo`);
        }
      }

      return heroes;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error('Error al obtener superhéroes');
    }
  }
}

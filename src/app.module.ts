import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { SuperheroesModule } from './superheroes/superheroes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RedisModule,
    SuperheroesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
    }),
  ],
})
export class AppModule {}

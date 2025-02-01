import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class Superhero {
  id: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @IsNotEmpty({ message: 'El superpoder es obligatorio' })
  @IsString({ message: 'El superpoder debe ser un texto' })
  superpower: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: 'La puntuación debe ser números y máximo 1 decimal' },
  )
  @Min(1, { message: 'La puntuación mínima es 1' })
  @Max(10, { message: 'La puntuación máxima es 10' })
  humilityScore: number;
}

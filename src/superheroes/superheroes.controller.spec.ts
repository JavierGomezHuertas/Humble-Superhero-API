import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { CreateSuperheroDto } from './create-superhero.dto';
import { Superhero } from './superheroes.entity';

describe('SuperheroesController', () => {
  let controller: SuperheroesController;
  let service: SuperheroesService;
  let mockRedisClient;

  beforeAll(() => {
    const validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    });
  });

  beforeEach(async () => {
    mockRedisClient = {
      hSet: jest.fn().mockResolvedValue(1),
      hGetAll: jest.fn().mockResolvedValue({
        name: 'Spider-Man',
        superpower: 'Tela araña',
        humilityScore: '8.5',
      }),
      zAdd: jest.fn().mockResolvedValue(1),
      sendCommand: jest.fn().mockResolvedValue(['1', '8.5', '2', '6.5']),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroesController],
      providers: [
        SuperheroesService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    controller = module.get<SuperheroesController>(SuperheroesController);
    service = module.get<SuperheroesService>(SuperheroesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validSuperhero: CreateSuperheroDto = {
      name: 'Spider-Man',
      superpower: 'Tela araña',
      humilityScore: 8.5,
    };

    it('should create a superhero successfully', async () => {
      const expectedResult: Superhero = {
        id: expect.any(String),
        ...validSuperhero,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(validSuperhero);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(validSuperhero);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should store superhero data in Redis', async () => {
      const result = await controller.create(validSuperhero);

      expect(mockRedisClient.hSet).toHaveBeenCalled();
      expect(mockRedisClient.zAdd).toHaveBeenCalled();
    });

    it('should throw an error if name is empty', async () => {
      const invalidSuperhero = {
        ...validSuperhero,
        name: '',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('El nombre es obligatorio'));

      await expect(
        controller.create(invalidSuperhero as CreateSuperheroDto),
      ).rejects.toThrow('El nombre es obligatorio');
    });

    it('should throw an error if humility score is out of range', async () => {
      const invalidSuperhero = {
        ...validSuperhero,
        humilityScore: 11,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('La puntuación máxima es 10'));

      await expect(
        controller.create(invalidSuperhero as CreateSuperheroDto),
      ).rejects.toThrow('La puntuación máxima es 10');
    });
  });

  describe('findAll', () => {
    const mockSuperheroes: Superhero[] = [
      {
        id: '1',
        name: 'Spider-Man',
        superpower: 'Tela araña',
        humilityScore: 8.5,
      },
      {
        id: '2',
        name: 'Iron Man',
        superpower: 'Super pasta',
        humilityScore: 6.5,
      },
    ];

    it('should return an array of superheroes ordered by humility score', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockSuperheroes);

      const result = await controller.findAll();

      expect(result).toEqual(mockSuperheroes);
      expect(service.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0].humilityScore).toBeGreaterThanOrEqual(
        result[1].humilityScore,
      );
    });

    it('should handle empty results', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
      mockRedisClient.sendCommand.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.sendCommand.mockRejectedValue(
        new Error('Redis connection error'),
      );
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Error al obtener superhéroes'));

      await expect(controller.findAll()).rejects.toThrow(
        'Error al obtener superhéroes',
      );
    });
  });
});

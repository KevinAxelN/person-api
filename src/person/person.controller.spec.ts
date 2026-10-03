import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

describe('PersonController', () => {
  let controller: PersonController;
  // bs bkin let service: jest.Mocked<PersonService>;
  // llu di bwh bs personService = module.get(PersonService);

  const mockPersonService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    updatePartialById: jest.fn(),
    deleteById: jest.fn()
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
      ],
    }).compile();
    
    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a person', async () => {
    const dto = {
      name: 'Budi',
      email: 'budi@gmail.com',
      age: 25,
      isMarried: false
    };

    const person = {
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPersonService.create.mockResolvedValue(person);

    const result = await controller.create(dto);

    expect(result).toEqual(person);
    expect(mockPersonService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all persons', async () => {
    const persons = [
      {
        id: 1,
        name: "Budi",
        email: "budi@mail.com",
        age: 26,
        isMarried: false,
        createdAt: "2026-09-29T06:22:45.414Z",
        updatedAt: "2026-09-29T06:22:45.427Z"
      },
      {
        id: 4,
        name: "Budi2",
        email: "budi2@mail.com",
        age: 25,
        isMarried: false,
        createdAt: "2026-09-29T09:39:48.643Z",
        updatedAt: "2026-09-29T09:39:48.643Z"
      }
    ];

    mockPersonService.getAll.mockResolvedValue(persons);
    const result = await controller.getAll();

    expect(result).toEqual(persons);
    expect(mockPersonService.getAll).toHaveBeenCalled();

  });

  it('should return a person by id', async () => {

    const id = 1;

    const person = {
      id: 1,
      name: "Budi",
      email: "budi@mail.com",
      age: 26,
      isMarried: false,
      createdAt: "2026-09-29T06:22:45.414Z",
      updatedAt: "2026-09-29T06:22:45.427Z"
    }

    mockPersonService.getById.mockResolvedValue(person);

    const result = await controller.getById(id);

    expect(result).toEqual(person);
    expect(mockPersonService.getById).toHaveBeenCalledWith(id);
  });

  it('should update a person', async () => {
    const id = 1;

    const dto = {
      name: 'Budi Updated',
      age: 27,
      isMarried: true,
    };

    const person = {
      id: 1,
      name: 'Budi Updated',
      email: 'budi@mail.com',
      age: 27,
      isMarried: true,
      createdAt: '2026-09-29T06:22:45.414Z',
      updatedAt: '2026-10-01T06:22:45.427Z',
    };

    mockPersonService.updatePartialById.mockResolvedValue(person);

    const result = await controller.update(id, dto);

    expect(result).toEqual(person);
    expect(mockPersonService.updatePartialById).toHaveBeenCalledWith(id, dto);
  });

  it('should delete a person', async () => {
    const id = 1;

    const person = {
      id: 1,
      name: 'Budi',
      email: 'budi@mail.com',
      age: 26,
      isMarried: false,
      createdAt: '2026-09-29T06:22:45.414Z',
      updatedAt: '2026-09-29T06:22:45.427Z',
    };

    mockPersonService.deleteById.mockResolvedValue(person);

    const result = await controller.delete(id);

    expect(result).toEqual(person);
    expect(mockPersonService.deleteById).toHaveBeenCalledWith(id);
  });

});
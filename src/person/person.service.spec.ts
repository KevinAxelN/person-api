import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PersonService } from './person.service';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

describe('PersonService', () => {
  let service: PersonService;
  let repository: jest.Mocked<Repository<Person>>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repository = module.get<jest.Mocked<Repository<Person>>>(getRepositoryToken(Person));
  });

  afterEach(() => {// before each jg lebih bgs
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================
  describe('create', () => {
    it('should create and save a person', async () => {
      const dto: CreatePersonDto = {
        name: 'Budi',
        email: 'budi@gmail.com',
        age: 25,
        isMarried: false,
      };

      const person: Person = {
        id: 1,
        ...dto,
        isMarried: dto.isMarried ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockReturnValue(person);
      repository.save.mockResolvedValue(person);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(person);
      expect(result).toEqual(person);
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto: CreatePersonDto = {
        name: 'Budi',
        email: 'budi@gmail.com',
        age: 25,
        isMarried: false,
      };

      const person: Person = {
        id: 1,
        ...dto,
        isMarried: dto.isMarried ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockReturnValue(person);

      repository.save.mockRejectedValue({
        code: 'ER_DUP_ENTRY',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    
    });

    it('should throw InternalServerErrorException when save fails', async () => {
      const dto = {
        name: 'Budi',
        email: 'budi@gmail.com',
        age: 25,
        isMarried: false,
      };

      const person: Person = {
        id: 1,
        ...dto,
        isMarried: dto.isMarried ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockReturnValue(person);

      repository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // =========================
  // GET ALL
  // =========================

  describe('getAll', () => {
    it('should return all persons', async () => {
      const persons: Person[] = [
        {
          id: 1,
          name: 'Budi',
          email: 'budi@mail.com',
          age: 26,
          isMarried: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Andi',
          email: 'andi@mail.com',
          age: 30,
          isMarried: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      repository.find.mockResolvedValue(persons);

      const result = await service.getAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(persons);
    });

    it('should return an empty array when no persons exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  // =========================
  // GET BY ID
  // =========================

  describe('getById', () => {
    it('should return a person by id', async () => {
      const person: Person = {
        id: 1,
        name: 'Budi',
        email: 'budi@mail.com',
        age: 26,
        isMarried: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOneBy.mockResolvedValue(person);

      const result = await service.getById(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });

      expect(result).toEqual(person);
    });

    it('should throw NotFoundException when person does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.getById(999)).rejects.toThrow(NotFoundException);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  // =========================
  // UPDATE
  // =========================

  describe('updatePartialById', () => {

    it('should update and return the updated person', async () => {
      const dto = {
        name: 'Budi Updated',
        age: 27,
        isMarried: true,
      };

      const updatedPerson: Person = {
        id: 1,
        name: 'Budi Updated',
        email: 'budi@mail.com',
        age: 27,
        isMarried: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.update.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: {},
      });

      repository.findOneBy.mockResolvedValue(updatedPerson);

      const result = await service.updatePartialById(1, dto);

      expect(repository.update).toHaveBeenCalledWith(
        { id: 1 },
        dto,
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });

      expect(result).toEqual(updatedPerson);
    });

    it('should throw NotFoundException when person does not exist', async () => {
      const dto: UpdatePersonDto = {
        name: 'Not Found',
      };
      repository.update.mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: {},
      });

      await expect(service.updatePartialById(999, dto)).rejects.toThrow(NotFoundException);

      expect(repository.update).toHaveBeenCalledWith(
        { id: 999 },
        dto,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      repository.update.mockRejectedValue({
        code: 'ER_DUP_ENTRY',
      });
      
      const dto: UpdatePersonDto = {
        email: "existing@mail.com"
      }

      await expect(
        service.updatePartialById(1, dto)
      ).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      repository.update.mockRejectedValue(
        new Error('Database error'),
      );

      const dto: UpdatePersonDto = {
        email: "existing@mail.com"
      }

      await expect(
        service.updatePartialById(1, dto)
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw NotFoundException when update succeeds but person cannot be found afterward', async () => {
      repository.update.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: {},
      });

      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updatePartialById(1, {
          name: 'Budi Updated',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // =========================
  // DELETE
  // =========================

  describe('deleteById', () => {
    it('should delete and return the person', async () => {
      const person: Person = {
        id: 1,
        name: 'Budi',
        email: 'budi@mail.com',
        age: 26,
        isMarried: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOneBy.mockResolvedValue(person);

      repository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      });

      const result = await service.deleteById(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });

      expect(repository.delete).toHaveBeenCalledWith({
        id: 1,
      });

      expect(result).toEqual(person);
    });

    it('should throw NotFoundException when person does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.deleteById(999),
      ).rejects.toThrow(NotFoundException);

      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when delete affects zero rows', async () => {
      const person: Person = {
        id: 1,
        name: 'Budi',
        email: 'budi@mail.com',
        age: 26,
        isMarried: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOneBy.mockResolvedValue(person);

      repository.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      });

      await expect(
        service.deleteById(1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
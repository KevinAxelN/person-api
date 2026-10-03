import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) // for nest js know // inject at runtime 
    private readonly personRepository: Repository<Person>, // class generic, Person ll n @ runt
  ) {}

  async create(dto: CreatePersonDto): Promise<Person> {
    
    try {
      
      const person = this.personRepository.create(dto);
  
      return await this.personRepository.save(person);

    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exist');
      }

      throw new InternalServerErrorException('Failed to create person');

    }
  }

  async getAll(): Promise<Person[]> {
    const persons = await this.personRepository.find();

    return persons; 
  }

  async getById(id: number): Promise<Person> {

    const person = await this.personRepository.findOneBy({ id });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  async updatePartialById(id: number, dto: UpdatePersonDto): Promise<Person> {
    try {
      const result = await this.personRepository.update({ id }, dto);
  
      if (result.affected == 0) {
        throw new NotFoundException('Person not found');
      }
  
      const person = await this.personRepository.findOneBy({ id });
  
      if (!person) {
        throw new NotFoundException('Person Not found');
      }
      
      return person;
    } catch(error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exist');
      }

      throw new InternalServerErrorException('Failed to update person');
    }
  }

  async deleteById(id: number): Promise<Person> {

    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundException('No Data Found');
    }
    const res = await this.personRepository.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException('No Data Found');
    }
    return person;
  }

}

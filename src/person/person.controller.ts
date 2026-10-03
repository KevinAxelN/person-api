import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { Person } from './person.entity';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {

  constructor(
    private readonly personService: PersonService
  ) {}

  @Post()
  create(@Body() dto: CreatePersonDto): Promise<Person> {
    return this.personService.create(dto);
  }

  @Get()
  getAll(): Promise<Person[]> {
    return this.personService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    // @Query('active', ParseBoolPipe) active: boolean

    return this.personService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto
  ): Promise<Person>{
    return this.personService.updatePartialById(id, dto);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Person> {
    return this.personService.deleteById(id);   
  }
}

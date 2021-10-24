import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private usersRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    const todo = new Todo();
    todo.isDone = createTodoDto.isDone ?? false;
    todo.title = createTodoDto.title;
    return this.usersRepository.save(todo);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ id });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    await this.usersRepository.update(
      {
        id,
      },
      { title: updateTodoDto.title, isDone: updateTodoDto.isDone },
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    const previous = await this.findOne(id);
    await this.usersRepository.delete({ id });
    return previous;
  }

  deleteAll() {
    return this.usersRepository.delete({});
  }
}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Todo } from '../entities/todo.entity';

export class CreateTodoDto extends PartialType(
  OmitType(Todo, ['id'] as const),
) {}

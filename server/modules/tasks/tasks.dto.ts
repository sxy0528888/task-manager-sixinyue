import { Type } from 'class-transformer';
import { IsString, IsIn, IsOptional, IsBoolean, Length } from 'class-validator';
import type { CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '@shared/api.interface';

export class CreateTaskDto implements CreateTaskRequest {
  @IsString()
  @Length(1, 255)
  title!: string;

  @IsString()
  @IsIn(['high', 'medium', 'low'])
  @Type(() => String)
  priority!: TaskPriority;
}

export class UpdateTaskDto implements UpdateTaskRequest {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsIn(['high', 'medium', 'low'])
  @Type(() => String)
  priority?: TaskPriority;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

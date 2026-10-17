import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { Inject } from '@nestjs/common';
import { tasks } from '../../database/schema';
import type { Task, TaskPriority } from '@shared/api.interface';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async findAll(priority?: TaskPriority | 'all'): Promise<Task[]> {
    const conditions = [];
    if (priority && priority !== 'all') {
      conditions.push(eq(tasks.priority, priority));
    }

    const query = conditions.length > 0
      ? this.db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt))
      : this.db.select().from(tasks).orderBy(desc(tasks.createdAt));

    const rows = await query;
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      priority: row.priority as TaskPriority,
      completed: row.completed,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const rows = await this.db.insert(tasks).values({
      title: dto.title,
      priority: dto.priority,
    }).returning();

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      priority: row.priority as TaskPriority,
      completed: row.completed,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const patch: Partial<typeof tasks.$inferInsert> = {};
    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.priority !== undefined) patch.priority = dto.priority;
    if (dto.completed !== undefined) patch.completed = dto.completed;

    if (Object.keys(patch).length === 0) {
      const existing = await this.db.select().from(tasks).where(eq(tasks.id, id));
      if (existing.length === 0) throw new NotFoundException('任务不存在');
      const row = existing[0];
      return {
        id: row.id,
        title: row.title,
        priority: row.priority as TaskPriority,
        completed: row.completed,
        createdAt: row.createdAt.toISOString(),
      };
    }

    const rows = await this.db.update(tasks)
      .set(patch)
      .where(eq(tasks.id, id))
      .returning();

    if (rows.length === 0) throw new NotFoundException('任务不存在');
    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      priority: row.priority as TaskPriority,
      completed: row.completed,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<void> {
    const rows = await this.db.delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });

    if (rows.length === 0) throw new NotFoundException('任务不存在');
  }
}

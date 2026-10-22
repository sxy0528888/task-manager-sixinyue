import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Task, TaskPriority } from '@shared/api.interface';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

interface TaskRow {
  id: string;
  title: string;
  priority: string;
  completed: boolean;
  _created_at: string;
}

@Injectable()
export class TasksService {
  private client: SupabaseClient | null = null;

  // 懒加载：避免缺少环境变量时应用启动崩溃（页面仍可正常渲染）
  private getClient(): SupabaseClient {
    if (this.client) return this.client;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('缺少 Supabase 环境变量：请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY');
    }
    this.client = createClient(url, key);
    return this.client;
  }

  private toTask(row: TaskRow): Task {
    return {
      id: row.id,
      title: row.title,
      priority: row.priority as TaskPriority,
      completed: row.completed,
      createdAt: row._created_at,
    };
  }

  async findAll(priority?: TaskPriority | 'all'): Promise<Task[]> {
    const client = this.getClient();
    let query = client
      .from('tasks')
      .select('id, title, priority, completed, _created_at')
      .order('_created_at', { ascending: false });

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => this.toTask(row as TaskRow));
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const client = this.getClient();
    const { data, error } = await client
      .from('tasks')
      .insert({ title: dto.title, priority: dto.priority })
      .select('id, title, priority, completed, _created_at')
      .single();

    if (error) throw error;
    return this.toTask(data as TaskRow);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const client = this.getClient();
    const patch: Record<string, unknown> = {};
    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.priority !== undefined) patch.priority = dto.priority;
    if (dto.completed !== undefined) patch.completed = dto.completed;

    if (Object.keys(patch).length === 0) {
      const existing = await client
        .from('tasks')
        .select('id, title, priority, completed, _created_at')
        .eq('id', id)
        .single();
      if (existing.error) {
        if ((existing.error as { code?: string }).code === 'PGRST116') {
          throw new NotFoundException('任务不存在');
        }
        throw existing.error;
      }
      return this.toTask(existing.data as TaskRow);
    }

    const { data, error } = await client
      .from('tasks')
      .update(patch)
      .eq('id', id)
      .select('id, title, priority, completed, _created_at')
      .single();

    if (error) {
      // PGRST116: 没有匹配行 → 按 404 处理
      if ((error as { code?: string }).code === 'PGRST116') {
        throw new NotFoundException('任务不存在');
      }
      throw error;
    }
    return this.toTask(data as TaskRow);
  }

  async remove(id: string): Promise<void> {
    const client = this.getClient();
    const { error, count } = await client
      .from('tasks')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    if (count === 0) throw new NotFoundException('任务不存在');
  }
}

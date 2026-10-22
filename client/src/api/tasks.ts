import { request } from './index';
import type {
  Task,
  TaskListResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskPriority,
} from '@shared/api.interface';

export async function getTasks(priority?: TaskPriority | 'all'): Promise<Task[]> {
  const params = new URLSearchParams();
  if (priority && priority !== 'all') {
    params.set('priority', priority);
  }
  const qs = params.toString();
  const data = await request<TaskListResponse>(`/api/tasks${qs ? `?${qs}` : ''}`);
  return data.items;
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  return request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
  return request<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteTask(id: string): Promise<void> {
  await request<void>(`/api/tasks/${id}`, { method: 'DELETE' });
}

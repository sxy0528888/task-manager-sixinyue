import { useState, useEffect, useCallback } from 'react';
import { Plus, Check, Trash2, ListTodo } from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tasksApi } from '@/api';
import type { Task, TaskPriority } from '@shared/api.interface';

const priorityLabel: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const priorityVariant: Record<TaskPriority, 'destructive' | 'default' | 'secondary'> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks(filterPriority);
      setTasks(data);
    } catch (error) {
      logger.error('加载任务失败', error);
    } finally {
      setLoading(false);
    }
  }, [filterPriority]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTask = await tasksApi.createTask({ title: title.trim(), priority });
      setTasks((prev) => [newTask, ...prev]);
      setTitle('');
      setPriority('medium');
    } catch (error) {
      logger.error('添加任务失败', error);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const updated = await tasksApi.updateTask(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (error) {
      logger.error('更新任务失败', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      logger.error('删除任务失败', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">智能任务管理</h1>
            <p className="text-sm text-slate-500">高效管理你的待办事项</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-slate-700">
                任务标题
              </label>
              <Input
                id="task-title"
                placeholder="请输入任务内容..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-32">
              <label htmlFor="task-priority" className="mb-1 block text-sm font-medium text-slate-700">
                优先级
              </label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger id="task-priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                添加任务
              </Button>
            </div>
          </form>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            任务列表
            <span className="ml-2 text-sm font-normal text-slate-500">
              共 {tasks.length} 条
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-priority" className="text-sm text-slate-600">
              筛选：
            </label>
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as TaskPriority | 'all')}>
              <SelectTrigger id="filter-priority" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              加载中...
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <ListTodo className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500">暂无任务</p>
              <p className="text-sm text-slate-400">添加你的第一个任务吧</p>
            </div>
          )}

          {!loading && tasks.length > 0 && tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <Button
                variant={task.completed ? 'default' : 'outline'}
                size="icon"
                aria-label={task.completed ? '标记为未完成' : '标记为已完成'}
                onClick={() => handleToggle(task)}
              >
                <Check className={`h-4 w-4 ${task.completed ? '' : 'opacity-0'}`} />
              </Button>

              <div className="flex-1 min-w-0">
                <p
                  className={`truncate text-base ${
                    task.completed
                      ? 'text-slate-400 line-through'
                      : 'text-slate-800'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(task.createdAt).toLocaleString('zh-CN')}
                </p>
              </div>

              <Badge variant={priorityVariant[task.priority]}>
                {priorityLabel[task.priority]}优先级
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                aria-label="删除任务"
                onClick={() => handleDelete(task.id)}
                className="text-slate-400 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;

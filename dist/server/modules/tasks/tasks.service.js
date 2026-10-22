"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TasksService", {
    enumerable: true,
    get: function() {
        return TasksService;
    }
});
const _common = require("@nestjs/common");
const _supabasejs = require("@supabase/supabase-js");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TasksService = class TasksService {
    // 懒加载：避免缺少环境变量时应用启动崩溃（页面仍可正常渲染）
    getClient() {
        if (this.client) return this.client;
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error('缺少 Supabase 环境变量：请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY');
        }
        this.client = (0, _supabasejs.createClient)(url, key);
        return this.client;
    }
    toTask(row) {
        return {
            id: row.id,
            title: row.title,
            priority: row.priority,
            completed: row.completed,
            createdAt: row._created_at
        };
    }
    async findAll(priority) {
        const client = this.getClient();
        let query = client.from('tasks').select('id, title, priority, completed, _created_at').order('_created_at', {
            ascending: false
        });
        if (priority && priority !== 'all') {
            query = query.eq('priority', priority);
        }
        const { data, error } = await query;
        if (error) throw error;
        return (data ?? []).map((row)=>this.toTask(row));
    }
    async create(dto) {
        const client = this.getClient();
        const { data, error } = await client.from('tasks').insert({
            title: dto.title,
            priority: dto.priority
        }).select('id, title, priority, completed, _created_at').single();
        if (error) throw error;
        return this.toTask(data);
    }
    async update(id, dto) {
        const client = this.getClient();
        const patch = {};
        if (dto.title !== undefined) patch.title = dto.title;
        if (dto.priority !== undefined) patch.priority = dto.priority;
        if (dto.completed !== undefined) patch.completed = dto.completed;
        if (Object.keys(patch).length === 0) {
            const existing = await client.from('tasks').select('id, title, priority, completed, _created_at').eq('id', id).single();
            if (existing.error) {
                if (existing.error.code === 'PGRST116') {
                    throw new _common.NotFoundException('任务不存在');
                }
                throw existing.error;
            }
            return this.toTask(existing.data);
        }
        const { data, error } = await client.from('tasks').update(patch).eq('id', id).select('id, title, priority, completed, _created_at').single();
        if (error) {
            // PGRST116: 没有匹配行 → 按 404 处理
            if (error.code === 'PGRST116') {
                throw new _common.NotFoundException('任务不存在');
            }
            throw error;
        }
        return this.toTask(data);
    }
    async remove(id) {
        const client = this.getClient();
        const { error, count } = await client.from('tasks').delete({
            count: 'exact'
        }).eq('id', id);
        if (error) throw error;
        if (count === 0) throw new _common.NotFoundException('任务不存在');
    }
    constructor(){
        this.client = null;
    }
};
TasksService = _ts_decorate([
    (0, _common.Injectable)()
], TasksService);

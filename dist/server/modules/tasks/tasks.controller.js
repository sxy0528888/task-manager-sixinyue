"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TasksController", {
    enumerable: true,
    get: function() {
        return TasksController;
    }
});
const _common = require("@nestjs/common");
const _tasksservice = require("./tasks.service");
const _tasksdto = require("./tasks.dto");
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
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let TasksController = class TasksController {
    async findAll(priority) {
        const pri = priority || 'all';
        const items = await this.tasksService.findAll(pri);
        return {
            items
        };
    }
    async create(dto) {
        return this.tasksService.create(dto);
    }
    async update(id, dto) {
        return this.tasksService.update(id, dto);
    }
    async remove(id) {
        await this.tasksService.remove(id);
    }
    constructor(tasksService){
        this.tasksService = tasksService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('priority')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tasksdto.CreateTaskDto === "undefined" ? Object : _tasksdto.CreateTaskDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _tasksdto.UpdateTaskDto === "undefined" ? Object : _tasksdto.UpdateTaskDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
TasksController = _ts_decorate([
    (0, _common.Controller)('api/tasks'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tasksservice.TasksService === "undefined" ? Object : _tasksservice.TasksService
    ])
], TasksController);

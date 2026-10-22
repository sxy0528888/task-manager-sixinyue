"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CreateTaskDto () {
        return CreateTaskDto;
    },
    get UpdateTaskDto () {
        return UpdateTaskDto;
    }
});
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
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
let CreateTaskDto = class CreateTaskDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.Length)(1, 255),
    _ts_metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'high',
        'medium',
        'low'
    ]),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", typeof TaskPriority === "undefined" ? Object : TaskPriority)
], CreateTaskDto.prototype, "priority", void 0);
let UpdateTaskDto = class UpdateTaskDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.Length)(1, 255),
    _ts_metadata("design:type", String)
], UpdateTaskDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'high',
        'medium',
        'low'
    ]),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", typeof TaskPriority === "undefined" ? Object : TaskPriority)
], UpdateTaskDto.prototype, "priority", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateTaskDto.prototype, "completed", void 0);

"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewController", {
    enumerable: true,
    get: function() {
        return ViewController;
    }
});
const _common = require("@nestjs/common");
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
let ViewController = class ViewController {
    render() {
        // 纯静态渲染入口页（已脱离妙搭平台，模板变量提供默认值）
        return {
            __platform__: '{}',
            appName: '智能任务管理',
            appDescription: '智能任务管理系统',
            appAvatar: ''
        };
    }
};
_ts_decorate([
    (0, _common.Get)([
        '/',
        '*'
    ]),
    (0, _common.Render)('index'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Record === "undefined" ? Object : Record)
], ViewController.prototype, "render", null);
ViewController = _ts_decorate([
    (0, _common.Controller)()
], ViewController);

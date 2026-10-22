// Vercel Serverless 应用引导：由 nest build（swc）编译，保留装饰器注入元数据
// 注意：不直接使用 __dirname 定位静态目录（esbuild 打包后 __dirname 会变化），
// 统一用 process.cwd()（Vercel 函数运行目录 = /var/task，dist 目录随 includeFiles 保留）
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "bootstrapServer", {
    enumerable: true,
    get: function() {
        return bootstrapServer;
    }
});
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _path = require("path");
const _hbs = require("hbs");
const _appmodule = require("./app.module");
let cachedApp = null;
async function bootstrapServer() {
    if (cachedApp) return cachedApp;
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        abortOnError: false
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    app.enableCors();
    app.useBodyParser('json', {
        limit: '1mb'
    });
    // 静态资源目录：dist/client（/assets、/favicon.svg 等）
    const staticDir = (0, _path.join)(process.cwd(), 'dist/client');
    // 入口 HTML 目录：dist/client/client/index.html（vite 构建产物位置）
    const viewsDir = (0, _path.join)(process.cwd(), 'dist/client/client');
    app.useStaticAssets(staticDir, {
        index: false
    });
    app.setBaseViewsDir(viewsDir);
    app.setViewEngine('html');
    app.engine('html', _hbs.__express);
    await app.init();
    cachedApp = app;
    return app;
}

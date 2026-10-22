"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _path = require("path");
const _hbs = require("hbs");
const _appmodule = require("./app.module");
// 纯自包含启动：不依赖妙搭平台运行时（PlatformModule / configureApp 已移除）
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        abortOnError: process.env.NODE_ENV !== 'development'
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
    const logger = new _common.Logger('Bootstrap');
    const host = process.env.SERVER_HOST || '0.0.0.0';
    const port = Number(process.env.SERVER_PORT || '3000');
    // 静态资源目录：dist/client（/assets、/favicon.svg 等）
    const staticDir = (0, _path.join)(__dirname, '..', 'client');
    // 入口 HTML 目录：dist/client/client/index.html（vite 构建产物位置）
    const viewsDir = (0, _path.join)(__dirname, '..', 'client', 'client');
    app.useStaticAssets(staticDir, {
        index: false
    });
    app.setBaseViewsDir(viewsDir);
    app.setViewEngine('html');
    app.engine('html', _hbs.__express);
    await app.listen(port, host);
    logger.log(`Server running on ${host}:${port}`);
    logger.log(`API endpoints ready at http://${host}:${port}/api`);
}
void bootstrap();

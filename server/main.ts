import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { __express as hbsExpressEngine } from 'hbs';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

// 纯自包含启动：不依赖妙搭平台运行时（PlatformModule / configureApp 已移除）
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: process.env.NODE_ENV !== 'development',
  });

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }),
  );
  app.enableCors();
  app.useBodyParser('json', { limit: '1mb' });

  const logger = new Logger('Bootstrap');
  const host = process.env.SERVER_HOST || '0.0.0.0';
  const port = Number(process.env.SERVER_PORT || '3000');

  // 静态资源目录：dist/client（/assets、/favicon.svg 等）
  const staticDir = join(__dirname, '..', 'client');
  // 入口 HTML 目录：dist/client/client/index.html（vite 构建产物位置）
  const viewsDir = join(__dirname, '..', 'client', 'client');
  app.useStaticAssets(staticDir, { index: false });
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('html');
  app.engine('html', hbsExpressEngine);

  await app.listen(port, host);
  logger.log(`Server running on ${host}:${port}`);
  logger.log(`API endpoints ready at http://${host}:${port}/api`);
}

void bootstrap();

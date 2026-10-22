// Vercel Serverless 入口：同一函数承载全部请求（API + 页面渲染 + 静态资源）
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { __express as hbsExpressEngine } from 'hbs';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../server/app.module';

let cachedApp: NestExpressApplication | null = null;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }),
  );
  app.enableCors();
  app.useBodyParser('json', { limit: '1mb' });

  // 静态资源目录：dist/client（/assets、/favicon.svg 等）
  const staticDir = join(process.cwd(), 'dist/client');
  // 入口 HTML 目录：dist/client/client/index.html（vite 构建产物位置）
  const viewsDir = join(process.cwd(), 'dist/client/client');
  app.useStaticAssets(staticDir, { index: false });
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('html');
  app.engine('html', hbsExpressEngine);

  await app.init();
  cachedApp = app;
  return app;
}

export default async function handler(req: unknown, res: unknown) {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance() as (r: unknown, s: unknown) => unknown;
  return server(req, res);
}

// Vercel Serverless 应用引导：由 nest build（swc）编译，保留装饰器注入元数据
// 注意：不直接使用 __dirname 定位静态目录（esbuild 打包后 __dirname 会变化），
// 统一用 process.cwd()（Vercel 函数运行目录 = /var/task，dist 目录随 includeFiles 保留）
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { __express as hbsExpressEngine } from 'hbs';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

let cachedApp: NestExpressApplication | null = null;

export async function bootstrapServer(): Promise<NestExpressApplication> {
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

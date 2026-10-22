// Vercel Serverless 入口（薄壳）：应用逻辑在编译后的 dist/server/vercel-entry.js
// 不在此处包含 NestJS 源码——避免 esbuild 打包丢失装饰器注入元数据
import { bootstrapServer } from '../dist/server/vercel-entry.js';

export default async function handler(req: unknown, res: unknown) {
  const app = await bootstrapServer();
  const server = app.getHttpAdapter().getInstance() as (r: unknown, s: unknown) => unknown;
  return server(req, res);
}

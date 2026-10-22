// Vercel Serverless 入口（纯 JS，不经 TS 编译）
// 应用逻辑在编译产物 dist/server/vercel-entry.js（nest build/swc 编译，保留装饰器注入元数据）
// 用 process.cwd() 绝对路径定位：Vercel 函数运行目录 = /var/task，includeFiles 已将 dist/** 放入函数包
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    const { bootstrapServer } = require(path.join(process.cwd(), 'dist/server/vercel-entry.js'));
    const app = await bootstrapServer();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (err) {
    console.error('[handler-crash]', err && err.stack ? err.stack : err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Function crashed: ' + (err && err.message));
    }
  }
};

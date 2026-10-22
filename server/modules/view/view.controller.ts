import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {

  @Get(['/', '*'])
  @Render('index')
  render(): Record<string, string> {
    // 纯静态渲染入口页（已脱离妙搭平台，模板变量提供默认值）
    return {
      __platform__: '{}',
      appName: '智能任务管理',
      appDescription: '智能任务管理系统',
      appAvatar: '',
    };
  }
}

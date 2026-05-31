# MFC 通用工具开发训练营

一个基于 Vite + React + TypeScript 的中文交互式学习网站，用来把“串口通讯、HTTP/TCP、MFC 框架、C++ 核心、SQLite/INI、多线程”等内容课程化，最终导向《MFC 通用调试工具》项目。

## 功能

- 首页 Hero、学习路线、7 个课程模块页面
- 11 个浏览器交互实验：串口参数、ASCII/HEX、Modbus、HTTP、TCP、MFC 消息映射、指针内存、STL、线程锁、SQLite、INI
- 每个模块 12 道测验，支持单选、多选、判断、代码判断、场景题
- 测验答题进度、提交后正确/错误高亮、错题强化回顾
- 学习仪表盘：模块掌握度、下一步建议、错题强化、进度导出/导入/重置
- 本地 MFC 实战模板：Dialog 骨架、串口 Tab、TCP 工作线程、SQLite/INI、统一日志
- 深色工程风 UI，响应式布局，适合宝塔/Nginx 静态部署

## 浏览器模拟边界

本网站所有实验都运行在浏览器内：

- 不真实打开串口，不调用 Web Serial 或本机驱动。
- 不建立真实 TCP Socket / WinSock 连接。
- 不连接真实 SQLite 数据库或写入服务器文件。
- `/codegen`、`/practice`、`/integration` 中的 C++/MFC/Win32/WinSock/SQLite 代码均为 Windows + Visual Studio + MFC 本地练习模板。

## 本地开发

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## 构建

```bash
npm run build
```

构建产物在 `dist/`。

## 宝塔/Nginx 部署说明

当前站点目录：

```bash
/www/wwwroot/studymfc.hpa888.top
```

当前项目源码和发布目录混在同一目录。**不要直接执行 `npm run build && cp -a dist/. ./`**，因为上一次发布后的生产版 `index.html` 可能覆盖开发入口，导致 Vite 把 `/assets/index-*.js` 当成入口构建。

推荐统一使用部署脚本：

```bash
cd /www/wwwroot/studymfc.hpa888.top
npm run deploy
```

该脚本会自动完成：

1. 恢复开发版 `index.html`（含 `/src/main.tsx`）。
2. 运行 `npm run build`。
3. 执行 `rm -rf assets && cp -a dist/. ./` 发布。
4. 通过 HTTPS + SNI 本机解析验证 `/`、`/modules/serial`、`/labs`、`/quiz`、`/resources`、`/dashboard`、主 JS、`robots.txt`、`sitemap.xml` 等关键路径。

SPA 深链路需要 Nginx 配置：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Vite hashed assets 建议长缓存：

```nginx
location ^~ /assets/ {
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    access_log off;
}
```

验证：

```bash
curl -k -I --resolve studymfc.hpa888.top:443:127.0.0.1 https://studymfc.hpa888.top/
curl -k -o /dev/null -w '%{http_code}\n' --resolve studymfc.hpa888.top:443:127.0.0.1 https://studymfc.hpa888.top/modules/serial
```

## SSL 诊断

如浏览器提示证书名称不匹配，请查看：

```text
docs/baota-ssl-runbook.md
```

当前已记录宝塔面板重新申请包含 `studymfc.hpa888.top` SAN 证书的步骤。

## 后续扩展建议

1. 增加真实 Visual Studio/MFC 代码模板下载。
2. 为每个实验增加“本地 MFC 实现提示”。
3. 题库扩展到每模块 12 题，并加入章节错题强化训练。
4. 增加学习路线图 SVG/信息图导出。
5. 增加最终项目打包、测试、日志导出章节。

# Overnight autonomous optimization plan — studymfc.hpa888.top

时间窗口：2026-05-30 22:25 CST 到 2026-05-31 08:00 CST 左右。

## 总原则

- 不重写整个项目；每轮先审计现状，再做小步高价值优化。
- 每轮必须：修改前检查 → 小步实现 → `npm run build` → 发布 `dist/.` → curl 验证关键路由/资源。
- 当前项目源码和发布目录混在 `/www/wwwroot/studymfc.hpa888.top`，每次构建前必须恢复开发版 `index.html`，否则 Vite 会把生产 assets 当入口。
- 若网络/API失败：等待到下一轮再试；连续失败则记录原因并跳过该项。
- 不真实接入串口/TCP/SQLite，浏览器内只做模拟。

## 优先级队列

1. P0 证书问题：检查 `studymfc.hpa888.top` SSL SAN。如果无法自动签发，记录宝塔面板操作步骤，不要破坏现有 HTTPS。
2. P1 源码/发布分离方案：优先评估是否能安全迁移到 `/www/wwwroot/studymfc-source` + `/www/wwwroot/studymfc.hpa888.top`。如风险高，先写部署脚本避免 index.html 污染。
3. P1 增加可靠部署脚本：`scripts/deploy-static.sh`，自动恢复 dev index、build、清理 assets、发布、验证。
4. P2 质量工具：增加 ESLint/基础测试脚本（优先不引入过多依赖；如网络安装失败，先补文档和脚本草案）。
5. P2 可访问性：补表单 label、aria-label、键盘导航、empty/loading/error 状态。
6. P2 实验增强：为 HEX/ASCII、HTTP、Modbus、INI 等增加复制按钮、错误提示、示例重置。
7. P2 知识漫画：用 baoyu-comic 工作流产出 MFC/串口/Modbus/指针/线程锁知识漫画 prompt；若 MGTV/Wan2.7Pro 凭据可用则批量生成图片并接入网站，否则先接入 prompt/占位卡片。
8. P3 内容增强：补课程模块深度、资源索引、最终项目验收清单、README/部署说明。

## 每轮输出要求

- 本轮做了什么
- 修改文件列表
- 构建/发布/验证结果
- 遇到的问题和下一轮计划

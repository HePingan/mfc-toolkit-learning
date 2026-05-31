# Code Audit Final Report

## Summary

- Repo clone: pass，已从 `https://github.com/HePingan/mfc-toolkit-learning` 克隆到 `/tmp/mfc-toolkit-learning-audit`。
- npm install: pass。
- npm run build: pass。
- npm run verify:routes: pass，`OK 34 routes, 3 assets @ http://127.0.0.1:4174`。
- npm run verify:mobile: pass，使用本地 preview `MOBILE_QA_BASE=http://127.0.0.1:4174`。
- npm run lint: pass。
- npm run format:check: pass。
- npm run typecheck: pass。
- npm run test: pass，5 个 Vitest localStorage regression tests 通过。
- npm run e2e: pass，Chromium 下 29 个 Playwright smoke tests 通过。
- GitHub Actions CI: 已新增 `.github/workflows/ci.yml`，本地等价命令已通过；推送后由 GitHub 执行。

## Baseline Findings

首次基线结果：

- `npm run build`: pass。
- `npm run verify:routes`: pass。
- `npm run verify:mobile`: fail，默认访问线上环境时报告 `index CSS asset not found`。CI 中已改为在本地 preview 上执行 mobile verification，避免依赖线上缓存/外部网络状态。

详见：`docs/audit/code-audit-baseline.md`。

## Added Quality Tooling

新增/补齐 npm scripts：

```json
{
  "typecheck": "tsc -b --pretty false",
  "lint": "eslint .",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "e2e": "playwright test"
}
```

新增工具：

- ESLint flat config: `eslint.config.js`
- Prettier config: `.prettierrc.json`, `.prettierignore`
- Vitest setup: `vite.config.ts`, `src/test/setup.ts`
- Playwright config: `playwright.config.ts`
- GitHub Actions: `.github/workflows/ci.yml`

## Console Error Audit

Playwright `tests/e2e/routes.spec.ts` 覆盖 27 个主要路由：

- `/`
- `/roadmap`
- `/modules/overview`
- `/modules/serial`
- `/labs`
- `/quiz`
- `/practice`
- `/codegen`
- `/designer`
- `/integration`
- `/build-checklist`
- `/troubleshooting`
- `/diagrams`
- `/review`
- `/planner`
- `/portfolio`
- `/demo-script`
- `/delivery`
- `/submit-rehearsal`
- `/evidence`
- `/reports`
- `/dashboard`
- `/search`
- `/glossary`
- `/notes`
- `/resources`
- `/comics`

每个路由检查：

- HTTP 2xx；
- `#root` 可见；
- 无 `console.error`；
- 无 uncaught page error；
- 无 failed request。

结果：Chromium route smoke 全部通过。

## Route Verification

`npm run verify:routes` 通过：

```text
[verify:routes] OK 34 routes, 3 assets @ http://127.0.0.1:4174
```

说明 SPA 子路由、静态资源引用和 fallback 基本稳定。

## Mobile Verification

`npm run verify:mobile` 在本地 preview 下通过：

```bash
MOBILE_QA_BASE=http://127.0.0.1:4174 npm run verify:mobile
```

结果：

```text
[mobile-qa-v7] PASS
```

CI 中已加入 preview 启动逻辑后再执行 mobile verification。

## Lab Interaction Audit

新增 `tests/e2e/labs.spec.ts`：

- 打开 `/labs`；
- 检查实验室页面渲染；
- 检查核心实验入口文本；
- 操作串口实验 select，将 COM 改为 COM4；
- 点击“标记完成”；
- 断言实验标题出现完成标记。

结果：通过。

## localStorage Audit

新增 Vitest regression tests：`src/hooks/useLocalStorage.test.tsx`

覆盖：

1. key 不存在时使用初始值；
2. 更新后写入 localStorage；
3. 支持函数式 updater；
4. localStorage 中存在坏 JSON 时安全回退；
5. `localStorage.setItem` 抛错时不会导致组件崩溃。

新增 Playwright E2E：`tests/e2e/local-storage.spec.ts`

覆盖：

- `/notes` 新增笔记；
- reload 后笔记仍存在；
- 注入坏的 progress JSON；
- `/dashboard` 仍能正常渲染。

结果：通过。

## TypeScript Strict Findings

`npm run typecheck` 通过，项目当前 TypeScript strict 检查可作为 CI 必过门禁。

## ESLint / Prettier Findings

ESLint 初次引入后发现并修复/处理：

- 脚本文件 Node/browser globals 未配置；
- 少量 unused variable；
- React hooks 新规则对现有 memo pattern 的过严提示；
- 部分正则/模板字符串触发 `no-useless-escape`。

处理方式：

- 添加 JS/MJS 和 TS/TSX 对应 ESLint globals；
- 修复未使用变量；
- 对现有代码关闭 React Compiler 相关过严规则，避免把非业务问题变成阻塞；
- 对数据模板和 mobile verify 脚本局部禁用 `no-useless-escape`。

Prettier 已格式化全仓源码与文档，`npm run format:check` 通过。

## Unit Test Coverage Summary

当前 Vitest 测试：

- `src/hooks/useLocalStorage.test.tsx`: 5 tests passed。

后续建议继续补：

- `src/utils/hex.ts`
- `src/utils/modbus.ts`
- `src/utils/ini.ts`
- `src/utils/http.ts`
- `src/utils/progress.ts`
- `src/utils/quiz.ts`

## Playwright Smoke Test Summary

Chromium 项目：29 tests passed。

覆盖：

- 所有主页面打开；
- console error / page error / failed request 检查；
- 实验交互 smoke；
- localStorage 持久化和坏数据恢复。

Mobile Chrome 项目已配置，但本地完整验证优先跑 Chromium，避免运行时间过长。CI 可按需要扩展为全部 projects。

## GitHub Actions CI Pipeline

新增 `.github/workflows/ci.yml`：

- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run verify:routes`
- 启动 preview 后执行 `MOBILE_QA_BASE=http://127.0.0.1:4174 npm run verify:mobile`
- 安装 Chromium
- `npm run e2e -- --project=chromium`
- 上传 Playwright report artifact

## Large File / Source Readability

当前仍有较大文件，建议后续单独拆分，不建议和质量工具同一个变更中继续扩大 diff：

```text
390 src/components/codegen/CodegenPanels.tsx
316 src/components/course/Diagrams.tsx
335 src/components/integration/IntegrationPanels.tsx
781 src/data/codegen.ts
1135 src/data/codegenTemplates.ts
313 src/data/designer.ts
329 src/data/glossary.ts
279 src/data/integration.ts
270 src/data/labs.ts
590 src/data/modules.ts
410 src/data/practice.ts
956 src/data/quizzes.ts
297 src/data/resources.ts
256 src/data/troubleshooting.ts
377 src/pages/DashboardPage.tsx
735 src/pages/DeliveryPage.tsx
434 src/pages/DemoScriptPage.tsx
349 src/pages/ExamPage.tsx
269 src/pages/NotesPage.tsx
403 src/pages/PlannerPage.tsx
302 src/pages/PortfolioPage.tsx
399 src/pages/ReviewPage.tsx
266 src/pages/SubmitRehearsalPage.tsx
457 src/routes.tsx
5976 src/styles/global.css
```

建议优先拆：

1. `src/styles/global.css` 按 layout/page/components 分层；
2. `src/data/codegenTemplates.ts` 和 `src/data/quizzes.ts` 按模块拆分；
3. `src/pages/DeliveryPage.tsx`、`DashboardPage.tsx`、`PlannerPage.tsx` 抽出 helper/components。

本轮只记录并建立检测基线，避免一次性重构风险过大。

## Remaining Risks

1. `npm run verify:mobile` 默认仍指向线上 `https://studymfc.hpa888.top`，线上缓存或网络波动可能影响结果；CI 已显式使用本地 `MOBILE_QA_BASE`。
2. Vitest 当前只覆盖 localStorage hook，utils 纯函数测试仍需扩展。
3. 大文件尚未实际拆分，只输出清单和建议。
4. Playwright mobile-chrome project 已配置，但 CI 当前只跑 Chromium；如需更强移动端保障，可在 CI 后续加入 `--project=mobile-chrome`。

## Recommended Next Steps

1. 单独做一轮 utils 单元测试补齐；
2. 单独做一轮大文件拆分，优先 CSS 和 data 文件；
3. 将 CI 状态 badge 加入 README；
4. 若需要线上部署前门禁，可让部署脚本先跑 `npm run lint && npm run typecheck && npm run test && npm run build && npm run verify:routes`。

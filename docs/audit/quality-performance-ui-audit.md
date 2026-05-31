# 质量、性能、导航与 UI 审计报告

## 审计范围

项目：`/www/wwwroot/studymfc.hpa888.top`

目标：为后续“工程质量 + 性能懒加载 + 导航收口 + UI 统一”建立基线，不直接做大规模重写。

## 当前工程质量状态

### 已具备的质量门禁

`package.json` 已包含：

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify:routes
npm run verify:mobile
npm run e2e
```

已存在：

- ESLint flat config；
- Prettier；
- Vitest；
- Playwright；
- GitHub Actions；
- route verification；
- mobile QA；
- 独立 published 发布目录，Nginx root 指向 `published/`。

### localStorage

核心封装：

```text
src/hooks/useLocalStorage.ts
src/data/storageKeys.ts
```

优点：

- 读写 try/catch；
- 支持 functional setter；
- 支持 validate/migrate；
- storage key 已集中管理；
- 有 Vitest 回归测试。

直接 localStorage 访问主要在 hook 和测试内；页面层大多通过 hook 使用。

### any 类型

扫描结果：

```text
\bany\b: 2
as any: 0
```

仅发现于 `src/hooks/useLocalStorage.test.tsx` 测试辅助代码，生产代码暂无明显 any 滥用。

## 路由与懒加载

### 当前状态

`src/routes.tsx` 已使用：

```tsx
React.lazy + Suspense;
```

页面级 lazy 已覆盖主要页面。

### 风险

`src/routes.tsx` 当前 457 行，混合了：

- lazy helper；
- 页面 import；
- route meta；
- PageMeta；
- LoadingFallback；
- Route JSX。

建议下一阶段拆分到：

```text
src/config/routeMeta.ts
src/config/routeRegistry.tsx
src/components/layout/LoadingFallback.tsx
```

## Bundle 基线

当前 build 关键结果：

```text
dist/assets/index-DDVuuW2l.css    93.15 kB │ gzip: 16.41 kB
dist/assets/index-Ba6GAqB5.js    277.71 kB │ gzip: 96.44 kB
dist/assets/CodegenPage-*.js     172.93 kB │ gzip: 53.21 kB
dist/assets/LabsPage-*.js         20.44 kB │ gzip: 7.61 kB
dist/assets/DeliveryPage-*.js     16.14 kB │ gzip: 6.78 kB
```

优先优化对象：

1. `CodegenPage`：页面 chunk 最大，且依赖模板和 ZIP 生成路径；
2. `index-*.js`：主包 gzip 96.44 kB，仍在可接受范围，但应设置预算防回归；
3. CSS：gzip 16.41 kB 可接受，但源文件过大，维护风险高。

## 大文件清单

```text
5976 src/styles/global.css
1135 src/data/codegenTemplates.ts
 956 src/data/quizzes.ts
 781 src/data/codegen.ts
 735 src/pages/DeliveryPage.tsx
 590 src/data/modules.ts
 457 src/routes.tsx
 434 src/pages/DemoScriptPage.tsx
 410 src/data/practice.ts
 403 src/pages/PlannerPage.tsx
 399 src/pages/ReviewPage.tsx
 390 src/components/codegen/CodegenPanels.tsx
 377 src/pages/DashboardPage.tsx
 349 src/pages/ExamPage.tsx
 335 src/components/integration/IntegrationPanels.tsx
 329 src/data/glossary.ts
 316 src/components/course/Diagrams.tsx
 313 src/data/designer.ts
 302 src/pages/PortfolioPage.tsx
 297 src/data/resources.ts
 279 src/data/integration.ts
 270 src/data/labs.ts
 269 src/pages/NotesPage.tsx
 266 src/pages/SubmitRehearsalPage.tsx
 256 src/data/troubleshooting.ts
 246 src/pages/EvidencePage.tsx
 240 src/pages/Home.tsx
 220 src/pages/ReportsPage.tsx
 217 src/pages/ResourcesPage.tsx
 209 src/pages/LabsPage.tsx
 200 src/pages/PracticePage.tsx
```

## 导航状态

已存在：

```text
src/config/navigation.ts
```

并被以下组件使用：

```text
Header
Sidebar
BottomTabBar
Home 部分快捷入口
Dashboard 工具入口
```

主要问题：

- Header 仍暴露过多入口；
- Sidebar、Home、Dashboard、BottomTabBar 的“入口职责”还没有明确边界；
- 移动端导航密度偏高；
- 后续应建立 `mainHeaderNav`、`toolNavGroups`、`homePrimaryActions` 等更明确配置。

## UI 与样式状态

主要风险：

```text
src/styles/global.css 5976 行
```

问题：

- tokens、layout、component、page-specific CSS 混在一起；
- 后续维护成本高；
- UI 统一难以渐进推进。

建议后续拆分：

```text
src/styles/tokens.css
src/styles/base.css
src/styles/layout.css
src/styles/components.css
src/styles/pages.css
```

## 重复代码状态

已较好封装：

```text
src/utils/download.ts
```

仍可优化：

- `navigator.clipboard?.writeText(...)` 分散在多个页面和组件；
- 可增加 `src/utils/clipboard.ts` 或 `useCopyFeedback`，统一复制失败提示。

## 白屏与部署风险

已完成关键修复：

- 源码目录和发布目录隔离；
- Nginx root 指向 `published/`；
- deploy 脚本检查 live site 是否误服务 `/src/main.tsx`；
- `verify-routes` 可检查构建入口。

当前正确状态应为：

```text
source index has dev entry: yes
published index has dev entry: no
```

## 优先级建议

### P0：保持稳定

- 每阶段都先跑完整验证；
- 不再把源码根目录作为 Nginx root；
- 保持 `published/` ignored。

### P1：路由和导航收口

- 拆 `routes.tsx`；
- 导航策略分层；
- 增加 navigation verification。

### P2：性能懒加载

- 优先处理 `CodegenPage` 和 codegen templates；
- 为 bundle 增加预算检查；
- 避免一次性拆所有 data 文件。

### P3：UI 统一

- 先 CSS 分层，不改视觉；
- 再引入 PageHero/ActionRow/MetricCard 等组件；
- 每次迁移 2-3 个页面。

## 下一步

建议直接从方案中的“阶段 1：路由配置拆分”开始执行，然后再做导航收口。

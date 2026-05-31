# 审计 + 工程质量 + 性能懒加载 + 导航收口 + UI 统一实施方案

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 在不重写项目的前提下，按低风险、小步提交方式提升 React/Vite 学习网站的稳定性、性能、导航一致性和 UI 统一度。

**Architecture:** 先守住质量门禁与部署安全，再把路由/导航/页面元信息收敛到单一配置，随后做懒加载分组和大页面拆分，最后统一 UI 组件和样式 token。每一阶段都必须通过本地与线上验证，避免再次出现白屏或子路由异常。

**Tech Stack:** React 19、Vite 5、TypeScript、React Router、ESLint、Prettier、Vitest、Playwright、BaoTa/Nginx 静态部署。

---

## 当前审计快照

### 已具备

- `src/routes.tsx` 已使用 `React.lazy` + `Suspense` 做页面级懒加载。
- `App.tsx` 已有全局 `ErrorBoundary`。
- `src/config/navigation.ts` 已存在，Header/Sidebar/BottomTabBar 已部分收口。
- `src/utils/download.ts` 已封装 `downloadBlob` / `downloadMarkdown` / `downloadJson`。
- `src/data/storageKeys.ts` 已集中管理 localStorage key。
- `npm run format:check`、`lint`、`typecheck`、`test`、`build`、`verify:routes`、`verify:mobile` 已可用。
- 线上已切到独立发布目录：`/www/wwwroot/studymfc.hpa888.top/published`，避免源码 `index.html` 再次造成白屏。

### 主要风险

- `src/routes.tsx` 457 行，路由、页面懒加载、meta、fallback 全混在一个文件，后续维护风险高。
- `src/styles/global.css` 5976 行，样式 token、布局、页面私有样式混合，UI 统一成本高。
- 大文件较多：`DeliveryPage.tsx` 735 行、`CodegenPage` chunk 172.93 kB、`codegenTemplates.ts` 1135 行、`quizzes.ts` 956 行。
- 导航仍存在多层重复入口：首页快捷、顶部导航、侧边工具、底部 tab、Dashboard 工具区。虽然部分复用 `navigation.ts`，但还没有统一“主导航 / 工程工具 / 交付工具 / 移动底栏”的显示策略。
- `CodegenPage` 首屏相关 chunk 最大，适合继续拆分重型 data/template 和 JSZip 路径。
- 部分页面仍直接使用 `navigator.clipboard`，复制失败时没有统一反馈；可作为 UI 统一阶段处理。

---

## 阶段 0：冻结基线与审计报告

**Objective:** 先记录现状，避免后续优化失控。

**Files:**

- Create: `docs/audit/quality-performance-ui-audit.md`

**Steps:**

1. 生成审计报告，包含：
   - 路由总数；
   - lazy chunk 列表；
   - 大文件列表；
   - localStorage 使用点；
   - download 封装使用点；
   - 导航来源点；
   - 当前验证命令结果。
2. 运行：
   ```bash
   npm run format:check
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   npm run verify:routes
   VERIFY_BASE_URL=https://studymfc.hpa888.top npm run verify:routes
   MOBILE_QA_BASE=https://studymfc.hpa888.top npm run verify:mobile
   ```
3. 预期：全部通过。
4. Commit：
   ```bash
   git add docs/audit/quality-performance-ui-audit.md
   git commit -m "docs: add quality performance ui audit"
   ```

---

## 阶段 1：路由配置拆分，降低白屏和维护风险

**Objective:** 把 `routes.tsx` 拆成 route config + meta + lazy helper，保持行为不变。

**Files:**

- Create: `src/config/routeMeta.ts`
- Create: `src/config/routeRegistry.tsx`
- Create: `src/components/layout/LoadingFallback.tsx`
- Modify: `src/routes.tsx`
- Modify: `scripts/verify-routes.mjs`

**Steps:**

1. 把 `routeMeta` 和 `resolveMeta()` 从 `src/routes.tsx` 移到 `src/config/routeMeta.ts`。
2. 把所有页面 lazy import 和 path 定义移到 `src/config/routeRegistry.tsx`，导出 `appRoutes`。
3. 把 `LoadingFallback` 移到 `src/components/layout/LoadingFallback.tsx`。
4. `src/routes.tsx` 只保留：`PageMeta`、`LazyRoute`、`AppRoutes` 映射渲染。
5. 为 route registry 增加可被脚本读取的 `routePaths`，后续 `verify-routes.mjs` 使用它或保持同源生成，减少路由遗漏。
6. 运行完整验证。
7. Commit：
   ```bash
   git add src/config/routeMeta.ts src/config/routeRegistry.tsx src/components/layout/LoadingFallback.tsx src/routes.tsx scripts/verify-routes.mjs
   git commit -m "refactor: centralize route registry and metadata"
   ```

**验收标准:**

- `src/routes.tsx` 从 457 行显著下降；
- 所有线上/本地路由仍 200；
- 浏览器首页和 `/labs` 无 console error。

---

## 阶段 2：导航收口，减少入口噪音

**Objective:** 明确导航层级，避免顶部导航过长、移动端入口过密。

**Files:**

- Modify: `src/config/navigation.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/BottomTabBar.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/DashboardPage.tsx`

**Navigation policy:**

- 顶部 Header：只放 5 个主入口：`首页 / 路线 / 实验 / 项目 / 仪表盘`。
- Sidebar：放完整工具矩阵，但分组显示：学习、工程、交付、资料。
- BottomTabBar：移动端只保留 5 个闭环入口：`首页 / 实验 / 仪表盘 / 复习 / 证据`。
- Home：快捷入口只放 4 个主要 CTA，工具入口改用 `homeToolShortcuts` 统一来源。
- Dashboard：工具区复用同一 `toolLinks`，避免自建数组。

**Steps:**

1. 在 `navigation.ts` 中建立：
   - `mainHeaderNav`
   - `toolNavGroups`
   - `bottomTabs`
   - `homePrimaryActions`
   - `homeToolShortcuts`
2. Header 改用 `mainHeaderNav`。
3. Sidebar 改用 `toolNavGroups`。
4. Home 删除本地重复 `quickActions` / `androidTools`，改用 config。
5. Dashboard 确认工具入口全部来自 config。
6. Playwright 补一个导航测试：Header 只展示主入口，Sidebar 工具链接可打开。
7. 验证并提交。

**验收标准:**

- 首页移动端不再出现超长导航堆叠；
- Header 数量收口；
- 所有导航链接都在 `verify-routes` 覆盖内。

---

## 阶段 3：性能懒加载与 chunk 优化

**Objective:** 降低首屏 JS 和重型页面 chunk 对性能的影响。

**Files:**

- Modify: `vite.config.ts`
- Modify: `src/pages/CodegenPage.tsx`
- Modify: `src/components/codegen/CodegenPanels.tsx`
- Possibly split: `src/data/codegenTemplates.ts`
- Possibly split: `src/data/quizzes.ts`
- Create: `src/components/lazy/LazyPanel.tsx` 或局部 lazy wrapper

**Steps:**

1. 在 `vite.config.ts` 增加 `manualChunks`：
   - `vendor-react`: react/react-dom/react-router-dom
   - `vendor-icons`: lucide-react
   - `vendor-zip`: jszip
   - `data-codegen`: codegen templates/data
2. 对 `CodegenPage` 做局部懒加载：
   - 初始只显示配置表单和说明；
   - ZIP 相关逻辑在用户点击生成/下载前再加载。
3. 如果 `codegenTemplates.ts` 仍过大，按模块拆成：
   - `src/data/codegen/templates/base.ts`
   - `src/data/codegen/templates/serial.ts`
   - `src/data/codegen/templates/network.ts`
   - `src/data/codegen/templates/storage.ts`
4. 对 `quizzes.ts` 按模块拆分，QuizPage 按选择模块后再加载对应题库。
5. 构建后记录 chunk 变化。
6. 验证并提交。

**验收标准:**

- 首屏 `index-*.js` 不上升，理想情况下下降；
- `CodegenPage` chunk 明显下降或重型依赖进入独立 chunk；
- `/codegen`、`/quiz` 交互测试通过。

---

## 阶段 4：UI 统一和 CSS 分层

**Objective:** 把 5976 行 `global.css` 分层，统一页面视觉和按钮/卡片/表单。

**Files:**

- Split from: `src/styles/global.css`
- Create:
  - `src/styles/tokens.css`
  - `src/styles/base.css`
  - `src/styles/layout.css`
  - `src/styles/components.css`
  - `src/styles/pages.css`
- Modify: `src/main.tsx`
- Modify UI components:
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Card.tsx`
  - possibly create `PageHero`, `PageSection`, `ActionRow`

**Steps:**

1. 只做 CSS 文件拆分，不改视觉。
2. `main.tsx` 按顺序 import：tokens → base → layout → components → pages。
3. 建立常用 UI 模式：
   - `PageHero`
   - `ActionRow`
   - `MetricCard` 或统一现有 Card usage。
4. 每次只迁移 2-3 个页面，避免大面积回归。
5. 用 Playwright 截图/路由 smoke 验证。
6. 验证并提交。

**验收标准:**

- `global.css` 不再是 5000+ 行单文件；
- 按钮、卡片、表单、badge 命名更统一；
- 首页、Labs、Dashboard、Codegen 移动端视觉无明显破坏。

---

## 阶段 5：工程质量增强

**Objective:** 增强质量门禁覆盖导航、chunk 预算和白屏风险。

**Files:**

- Create: `scripts/verify-navigation.mjs`
- Create: `scripts/verify-bundle-budget.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `tests/e2e/routes.spec.ts`

**Steps:**

1. `verify-navigation.mjs`：扫描 `navigation.ts` 的所有 `to`，确认 route registry 存在。
2. `verify-bundle-budget.mjs`：读取 `dist/assets`，设置软预算：
   - main gzip < 110 kB；
   - 单页面 chunk gzip < 60 kB；
   - CSS gzip < 25 kB。
3. package scripts 增加：
   ```json
   "verify:navigation": "node scripts/verify-navigation.mjs",
   "verify:bundle": "node scripts/verify-bundle-budget.mjs"
   ```
4. CI 加入这两个验证。
5. Playwright route 测试增加 lazy route console/pageerror 采样。
6. 验证并提交。

**验收标准:**

- CI 能自动发现导航链接不存在、bundle 体积明显膨胀、dev index 被发布。

---

## 推荐执行顺序

1. 阶段 0：审计报告和基线冻结。
2. 阶段 1：路由配置拆分。
3. 阶段 2：导航收口。
4. 阶段 5 的 `verify-navigation` 可提前插入阶段 2 后。
5. 阶段 3：性能懒加载和 chunk 优化。
6. 阶段 4：UI/CSS 分层。
7. 阶段 5 剩余 bundle budget 和 CI 加固。

每阶段都必须执行：

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify:routes
VERIFY_BASE_URL=https://studymfc.hpa888.top npm run verify:routes
MOBILE_QA_BASE=https://studymfc.hpa888.top npm run verify:mobile
```

部署阶段额外执行：

```bash
npm run deploy
```

---

## 本轮先执行内容

为了低风险推进，本轮先执行：

1. 保存本方案；
2. 生成阶段 0 审计报告；
3. 不做大规模重构；
4. 通过全部验证；
5. 提交推送；
6. 下一轮从“阶段 1：路由配置拆分”开始。

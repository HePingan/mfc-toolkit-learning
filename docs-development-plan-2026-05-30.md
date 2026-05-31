# studymfc.hpa888.top 下一阶段完善开发计划

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 在现有 `MFC 通用工具开发训练营` 基础上，对照 DOCX 产品方案补齐“课程正文深度、资源体系、练习闭环、真实上位机项目交付感”，继续把站点从可用学习站升级为更完整的 C++/MFC 上位机学习平台。

**Architecture:** 保持当前 Vite + React + TypeScript 纯前端架构，继续使用 `src/data` 数据驱动课程、实验、测验、资源和生成器；新增功能仍以浏览器模拟 + localStorage 为主，不引入后端。真实串口、TCP、SQLite、MFC 编译均保持为 Windows + Visual Studio 本地实践指导或代码模板生成，不在浏览器真实执行。

**Tech Stack:** Vite 5.4.21、React 19、TypeScript、React Router、localStorage、JSZip、宝塔/Nginx 静态部署。

---

## 0. 当前检查结论（2026-05-30）

### 已完成度较高的内容

现有项目已经不只是“开发了一部分”，而是完成了 DOCX 中大多数核心骨架和不少后续增强：

- 路由完整：`/`、`/roadmap`、`/modules/:id`、`/labs`、`/quiz`、`/capstone`、`/resources`。
- 后续增强也已存在：`/dashboard`、`/practice`、`/codegen`、`/designer`、`/integration`、`/troubleshooting`、`/reports`、`/glossary`、`/search`、`/notes`。
- 课程模块：7 个模块，对应 DOCX 的导览、串口、网络、MFC、C++、SQLite/INI、综合项目。
- 交互实验：11 个，覆盖 DOCX 要求的串口参数、ASCII/HEX、Modbus、HTTP、TCP、MFC 消息映射、指针、STL、线程锁、SQLite、INI。
- 测验：当前 `src/data/quizzes.ts` 为每个模块 12 题，共 84 题，已超过 DOCX “每模块至少 8 题”的最低要求。
- Capstone：已有项目目标、开发步骤、架构图、必做/加分验收清单、localStorage 自评。
- 本地实战桥接：已有 `/practice`、`/codegen`、`/designer`、`/integration`，这已经超过原 DOCX MVP。
- 构建可通过：`npm run build` 成功。
- 线上深链路可访问：`/roadmap`、`/modules/serial`、`/labs`、`/quiz`、`/capstone`、`/dashboard`、`/practice`、`/codegen`、`/designer`、`/integration`、`/troubleshooting`、`/reports`、`/glossary`、`/search`、`/notes`、`/resources` 均返回 200。

### 发现的工程注意点

- 当前站点根目录的 `index.html` 是发布后的构建入口，指向 `/assets/index-DnMnRZbK.js`。
- `npm run build` 会生成新的 `dist/assets/index-DUCQJKPD.js`，但尚未发布到站点根目录。
- 因为项目源代码和发布文件混放在同一个 BaoTa 站点根目录，后续每次开发前要先恢复开发版 `index.html`，再构建发布，避免 Vite 误把旧构建产物当入口。
- 正确发布流程见本文最后“构建与发布流程”。

---

## 1. 缺口对照 DOCX

### A. 课程正文还偏“提纲化”

DOCX 要求每章包含：学习目标、先导概念、图解知识点、交互实验、常见坑、小测验、代码片段、本章任务、下一步建议。当前 `modules.ts` 有这些字段的雏形，但正文深度仍偏短，特别是：

- MFC 创建项目详细步骤不够；
- 串口本地实践排错步骤不够；
- TCP 粘包/拆包、断线重连解释不够；
- SQLite 参数化查询、路径、编码说明不够；
- 每章“本地 Visual Studio 实战任务”还可以更明确。

### B. Resources 页面太简陋

`src/pages/ResourcesPage.tsx` 目前只有 7 行，功能能用但不够像正式资源页。DOCX 要求资源页展示学习链接、术语表、推荐学习顺序、来源 URL。当前资源页建议增强：

- 资源分类筛选：环境搭建、MFC、串口/Modbus、TCP/HTTP、SQLite/INI、工具下载、项目模板；
- 搜索框；
- 原文来源与改编说明；
- “下一步应该看什么”的资源推荐；
- 与 `/glossary` 分工：Resources 放链接和下载/参考，Glossary 放术语。

### C. 代码骨架生成器还可以继续贴近真实 MFC 工程

当前 `/codegen` 已经很强，但下一步最有价值的是把模板变成“初学者可按步骤落地”的包：

- 对每个生成文件加“复制到 VS 哪个位置”的说明；
- 增加 `README_如何导入VisualStudio.md`；
- 增加 `测试步骤.md`：先空项目编译，再单模块编译；
- 增加 `错误排查.md` 与 `/integration`、`/troubleshooting` 联动；
- 对串口/TCP/HTTP/SQLite 模块加更明确的依赖提示。

### D. 练习闭环可以更强

当前有测验、错题、Dashboard、报告，但还可以把“学完一章 → 做实验 → 做本地任务 → 查看报告”的闭环串起来：

- Module 页面显示本章对应本地实践任务入口；
- Labs 页面每个实验显示“对应 MFC 本地实现提示”；
- Quiz 提交后给出下一步：复习概念 / 重做实验 / 进入本地实践；
- Reports 中加入“项目交付缺口清单”。

### E. 视觉和首页营销感还能提升

DOCX 对首页和 UI 风格要求较高：现代工程师学习站、开发者文档、SaaS 控制台、深色科技感。当前已是深色工程风，但下一步可以：

- 首页增加“一图看懂学习路线”的视觉区；
- 首页增加最终项目 UI 预览卡；
- Roadmap 增加模块依赖箭头和完成状态；
- Capstone 增加更直观的 UI/架构双图。

---

## 2. 推荐下一阶段开发顺序

优先级按“对学习效果提升最大 + 不破坏现有架构”排序。

## Phase 1：补强课程正文与模块任务闭环

**目标：** 让每个模块从提纲变成真正能教人的章节。

### Task 1.1：扩展 `CourseModule` 数据结构

**Files:**

- Modify: `src/data/modules.ts`
- Modify: `src/pages/ModulePage.tsx`

**内容：**
为模块增加可选字段：

```ts
localPractice?: {
  title: string;
  steps: string[];
  acceptance: string[];
  relatedRoute?: string;
};
chapterSummary?: string;
nextActions?: string[];
```

**验收：**

- 每个模块页底部显示“本章本地实战任务”；
- 显示验收标准；
- 可跳转到 `/practice` 或 `/codegen`。

### Task 1.2：补充 7 个模块正文

**Files:**

- Modify: `src/data/modules.ts`

**补充方向：**

- `overview`：VS/MFC 环境安装、为什么浏览器只能模拟；
- `serial`：COM 口排查、RS232/RS485 区别、Modbus CRC 注意事项；
- `network`：HTTP vs TCP、粘包/拆包、超时、断线重连；
- `mfc`：Dialog 创建、控件 ID、DDX、Message Map、UI 线程；
- `cpp-core`：RAII、智能指针、线程生命周期；
- `storage`：SQLite 参数化查询、INI 编码、路径权限；
- `capstone`：模块拆分、开发顺序、测试打包。

**验收：**

- 每章至少 4 个正文 section；
- 每章至少 1 段示例代码或伪代码；
- 每章有本地实践任务和验收标准。

### Task 1.3：Module 页面加入“学完本章后做什么”

**Files:**

- Modify: `src/pages/ModulePage.tsx`

**验收：**

- 显示下一步按钮：做实验、做测验、本地实战、下一章；
- 根据模块是否有 labs 自动显示实验入口；
- 保持移动端布局正常。

---

## Phase 2：重做 Resources 页面

**目标：** 把资源页从简单列表升级为正式学习资源中心。

### Task 2.1：扩展资源数据模型

**Files:**

- Modify: `src/data/resources.ts`

**建议字段：**

```ts
export type ResourceItem = {
  title: string;
  kind: '官方文档' | '工具' | '教程' | '速查表' | '项目模板' | '原始来源';
  category: '环境搭建' | 'MFC' | '串口/Modbus' | 'HTTP/TCP' | 'C++' | 'SQLite/INI' | '综合项目';
  url: string;
  note: string;
  recommendedFor: string[];
};
```

**验收：**

- 至少 30 条资源；
- 保留原始来源 `https://blog.1ct7.top/read_12`；
- 资源按分类可筛选。

### Task 2.2：重构 `ResourcesPage`

**Files:**

- Modify: `src/pages/ResourcesPage.tsx`
- Modify: `src/styles/global.css`

**功能：**

- 搜索；
- 分类筛选；
- 资源卡片；
- 推荐学习顺序；
- 来源说明；
- 与 `/glossary` 的入口。

**验收：**

- 页面不再是一行 JSX；
- 搜索关键字能过滤资源；
- 点击分类能过滤；
- 移动端卡片不溢出。

---

## Phase 3：实验页增加“本地 MFC 实现提示”

**目标：** 把浏览器实验和 Windows/MFC 实战连接起来。

### Task 3.1：扩展 Lab 数据

**Files:**

- Modify: `src/data/labs.ts`
- Modify: `src/pages/LabsPage.tsx`

**新增字段：**

```ts
mfcHint?: {
  files: string[];
  controls: string[];
  implementationSteps: string[];
  commonPitfalls: string[];
};
```

**验收：**

- 每个实验卡片展示“本地实现提示”；
- 有按钮跳转 `/codegen` 或 `/designer`；
- 明确提示浏览器不真实访问串口/TCP/SQLite。

### Task 3.2：为 11 个实验补齐实现提示

**Files:**

- Modify: `src/data/labs.ts`

**重点：**

- 串口实验对应 `SerialManager.h/.cpp`；
- TCP 实验对应 `TcpClient/TcpServer`；
- HTTP 实验对应 `HttpClient`；
- SQLite/INI 对应 `ConfigStore`；
- MFC 消息映射对应 Dialog 控件 ID、Message Map、按钮 Handler。

---

## Phase 4：代码生成器交付包增强

**目标：** 让 `/codegen` 生成的 ZIP 更像“可交付练习包”。

### Task 4.1：ZIP 增加导入和测试文档

**Files:**

- Modify: `src/data/codegen.ts`
- Modify: `src/data/miniProject.ts`
- Possibly Modify: `src/components/codegen/CodegenPanels.tsx`

**新增 ZIP 文件：**

- `docs/README_如何导入VisualStudio.md`
- `docs/测试步骤.md`
- `docs/常见编译错误.md`
- `docs/模块依赖说明.md`
- `docs/验收清单.md`

**验收：**

- ZIP 内包含以上文档；
- 文档内容与 `/integration` 流程一致；
- 页面预览能看到这些文档文件。

### Task 4.2：代码模板标注“教学版/实用版/基础版”差异

**Files:**

- Modify: `src/data/codegenTemplates.ts`
- Modify: `src/components/codegen/CodegenPanels.tsx`

**验收：**

- 切换 mode 后，说明文字和生成文件都有明显区别；
- 实用版更接近真实工程；
- 教学版注释更多，适合初学者。

---

## Phase 5：学习闭环与报告增强

**目标：** 让用户知道下一步该学什么、补什么、做什么。

### Task 5.1：Quiz 提交后给出下一步建议

**Files:**

- Modify: `src/components/quiz/QuizRunner.tsx`
- Modify: `src/components/quiz/ScorePanel.tsx`

**逻辑：**

- 分数 >= 85：建议进入本地实战或下一章；
- 60~84：建议复习错题并重做实验；
- < 60：建议回到模块页重读核心概念。

**验收：**

- 提交后显示具体按钮：模块页、实验页、本地实战、下一章。

### Task 5.2：Reports 增加项目交付缺口清单

**Files:**

- Modify: `src/utils/report.ts`
- Modify: `src/pages/ReportsPage.tsx`
- Modify: `src/components/report/ReportCards.tsx`

**内容：**

- 未完成模块；
- 未完成实验；
- 未完成本地实践任务；
- Capstone 未勾选项；
- 错题集中模块；
- 下一周学习建议。

**验收：**

- 报告 Markdown 导出包含“项目交付缺口”；
- JSON 导出也包含缺口字段。

---

## Phase 6：视觉信息图增强

**目标：** 更接近 DOCX 中“首页路线图 / 架构图 / 工程感”的成品效果。

### Task 6.1：首页增加学习路线信息图

**Files:**

- Modify: `src/pages/Home.tsx`
- Modify: `src/components/course/Diagrams.tsx`
- Modify: `src/styles/global.css`

**验收：**

- 首页展示 7 模块路线图；
- 每个节点显示完成状态；
- 点击节点进入对应模块。

### Task 6.2：Capstone 增加最终软件 UI 草图

**Files:**

- Modify: `src/pages/CapstonePage.tsx`
- Modify: `src/components/course/Diagrams.tsx`

**内容：**
画一个 MFC 通用调试工具界面草图：

- Tab：Serial / TCP Client / TCP Server / HTTP / Settings；
- 左侧参数面板；
- 中间发送/接收区；
- 右侧日志；
- 底部状态栏。

**验收：**

- 不依赖外部图片；
- 用 React/CSS/SVG 实现；
- 移动端能正常缩放。

---

## 3. 暂不建议做的事

- 暂不加后端账号系统：当前 localStorage 足够，后端会增加维护成本。
- 暂不在浏览器真实访问串口：Web Serial API 有浏览器限制，不适合当前教学主线。
- 暂不做真实 TCP Socket：浏览器不能直接做传统 TCP Socket，应继续模拟。
- 暂不把 MFC 代码说成可直接一键编译：应保持“模板 + 本地按步骤集成”的定位。

---

## 4. 构建与发布流程（重要）

由于当前源码和发布文件都在 `/www/wwwroot/studymfc.hpa888.top`，每次发布请严格按以下顺序：

```bash
cd /www/wwwroot/studymfc.hpa888.top

# 1. 恢复开发版 index.html，避免 Vite 用旧 assets 当入口
cat > index.html <<'EOF'
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MFC 通用工具开发训练营</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# 2. 清理旧构建产物
rm -rf dist assets

# 3. 构建
npm run build

# 4. 发布到 BaoTa 站点根目录
cp -a dist/. /www/wwwroot/studymfc.hpa888.top/

# 5. 验证根路由、深链路、资源文件
curl -k -I --resolve studymfc.hpa888.top:443:127.0.0.1 https://studymfc.hpa888.top/
curl -k -o /dev/null -w '%{http_code}\n' --resolve studymfc.hpa888.top:443:127.0.0.1 https://studymfc.hpa888.top/modules/serial
curl -k -o /dev/null -w '%{http_code}\n' --resolve studymfc.hpa888.top:443:127.0.0.1 https://studymfc.hpa888.top/codegen
```

---

## 5. 我建议马上执行的第一步

建议先做 **Phase 1 + Phase 2**：

1. 扩展 `modules.ts`，把 7 个模块正文和本地实践任务补强；
2. 重构 `ResourcesPage`，做成正式资源中心；
3. 构建、发布、验证。

原因：这两项最贴近 DOCX 原始要求，也最能提升学习网站的内容价值，不会破坏现有 `/codegen`、`/designer`、`/integration` 等高级功能。

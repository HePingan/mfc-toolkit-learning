import { Suspense, lazy, useEffect, type ComponentType, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

function lazyPage<T extends Record<string, ComponentType<object>>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K,
) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName] as ComponentType<object> };
  });
}

const Home = lazyPage(() => import('./pages/Home'), 'Home');
const Roadmap = lazyPage(() => import('./pages/Roadmap'), 'Roadmap');
const ModulePage = lazyPage(() => import('./pages/ModulePage'), 'ModulePage');
const LabsPage = lazyPage(() => import('./pages/LabsPage'), 'LabsPage');
const QuizPage = lazyPage(() => import('./pages/QuizPage'), 'QuizPage');
const CapstonePage = lazyPage(() => import('./pages/CapstonePage'), 'CapstonePage');
const ResourcesPage = lazyPage(() => import('./pages/ResourcesPage'), 'ResourcesPage');
const DashboardPage = lazyPage(() => import('./pages/DashboardPage'), 'DashboardPage');
const PracticePage = lazyPage(() => import('./pages/PracticePage'), 'PracticePage');
const SearchPage = lazyPage(() => import('./pages/SearchPage'), 'SearchPage');
const GlossaryPage = lazyPage(() => import('./pages/GlossaryPage'), 'GlossaryPage');
const NotesPage = lazyPage(() => import('./pages/NotesPage'), 'NotesPage');
const TroubleshootingPage = lazyPage(
  () => import('./pages/TroubleshootingPage'),
  'TroubleshootingPage',
);
const ReportsPage = lazyPage(() => import('./pages/ReportsPage'), 'ReportsPage');
const CodegenPage = lazyPage(() => import('./pages/CodegenPage'), 'CodegenPage');
const DesignerPage = lazyPage(() => import('./pages/DesignerPage'), 'DesignerPage');
const IntegrationPage = lazyPage(() => import('./pages/IntegrationPage'), 'IntegrationPage');
const BuildChecklistPage = lazyPage(
  () => import('./pages/BuildChecklistPage'),
  'BuildChecklistPage',
);
const ComicsPage = lazyPage(() => import('./pages/ComicsPage'), 'ComicsPage');
const DiagramsPage = lazyPage(() => import('./pages/DiagramsPage'), 'DiagramsPage');
const ReviewPage = lazyPage(() => import('./pages/ReviewPage'), 'ReviewPage');
const PlannerPage = lazyPage(() => import('./pages/PlannerPage'), 'PlannerPage');
const ExamPage = lazyPage(() => import('./pages/ExamPage'), 'ExamPage');
const PortfolioPage = lazyPage(() => import('./pages/PortfolioPage'), 'PortfolioPage');
const DemoScriptPage = lazyPage(() => import('./pages/DemoScriptPage'), 'DemoScriptPage');
const DeliveryPage = lazyPage(() => import('./pages/DeliveryPage'), 'DeliveryPage');
const SubmitRehearsalPage = lazyPage(
  () => import('./pages/SubmitRehearsalPage'),
  'SubmitRehearsalPage',
);
const EvidencePage = lazyPage(() => import('./pages/EvidencePage'), 'EvidencePage');
const NotFoundPage = lazyPage(() => import('./pages/NotFoundPage'), 'NotFoundPage');

type Meta = { title: string; description: string };

const routeMeta: Record<string, Meta> = {
  '/': {
    title: '首页 - MFC 通用工具开发训练营',
    description: '从学习路线、交互实验、测验和最终项目进入 MFC 通用工具开发训练。',
  },
  '/roadmap': {
    title: '学习路线 - MFC 通用工具开发训练营',
    description: '按环境、串口、网络、MFC、C++、数据存储到最终项目的顺序学习。',
  },
  '/labs': {
    title: '实验中心 - MFC 通用工具开发训练营',
    description:
      '浏览器内模拟串口参数、HEX/ASCII、Modbus、HTTP、TCP、MFC 消息映射、C++ 内存和线程。',
  },
  '/quiz': {
    title: '测验中心与错题本 - MFC 通用工具开发训练营',
    description: '按模块练习单选、多选、判断、代码判断和场景题，保存成绩与错题。',
  },
  '/capstone': {
    title: '最终项目 - MFC 通用工具开发训练营',
    description: 'MFC 通用调试工具最终项目目标、架构、验收清单与扩展建议。',
  },
  '/resources': {
    title: '资源页 - MFC 通用工具开发训练营',
    description: 'MFC、串口、TCP、HTTP、SQLite、INI 与工程实践资料索引。',
  },
  '/dashboard': {
    title: '学习进度面板 - MFC 通用工具开发训练营',
    description: '查看总进度、模块完成、实验完成、测验成绩、错题、徽章和下一步推荐。',
  },
  '/practice': {
    title: '本地 MFC 实战 - MFC 通用工具开发训练营',
    description: '将浏览器实验迁移到 Windows + Visual Studio + MFC 项目中的本地实践清单。',
  },
  '/codegen': {
    title: 'MFC 代码骨架生成器 - MFC 通用工具开发训练营',
    description: '浏览器生成 MFC 工具项目骨架、控件 ID、Message Map 和 ZIP 交付包。',
  },
  '/designer': {
    title: 'MFC Dialog 设计器 - MFC 通用工具开发训练营',
    description: '规划 MFC Dialog 控件布局、控件 ID 和事件处理函数。',
  },
  '/integration': {
    title: 'MFC 集成向导 - MFC 通用工具开发训练营',
    description: '将生成代码接入 Visual Studio / MFC 项目并排查编译链接问题。',
  },
  '/build-checklist': {
    title: '构建检查清单 - MFC 通用工具开发训练营',
    description: '按 Visual Studio 实操阶段保存 MFC 本地构建和验收进度。',
  },
  '/comics': {
    title: '知识漫画工坊 - MFC 通用工具开发训练营',
    description:
      '用知识漫画 prompt 图解串口、Modbus、MFC 消息映射、线程锁和 SQLite/INI，可接入 Wan2.7Pro 出图。',
  },
  '/diagrams': {
    title: '图解中心 - MFC 通用工具开发训练营',
    description: '集中查看学习路线、模块结构、实验矩阵、执行链路和 Visual Studio 迁移图。',
  },
  '/review': {
    title: '复习训练台 - MFC 通用工具开发训练营',
    description: '把错题、术语、实验复盘和本地实践验收点整理成可翻面的复习卡片。',
  },
  '/planner': {
    title: '学习计划生成器 - MFC 通用工具开发训练营',
    description: '按 7/14/30 天节奏生成课程、实验、测验、复习、本地 MFC 实战与交付计划。',
  },
  '/exam': {
    title: '面试答辩训练 - MFC 通用工具开发训练营',
    description: '把课程模块、实验、本地实战和最终项目验收转成面试/答辩问答与证据记录。',
  },
  '/portfolio': {
    title: '作品集简历素材 - MFC 通用工具开发训练营',
    description:
      '把学习进度、实战模板、Capstone 验收和答辩记录整理成简历、README 和项目作品集素材。',
  },
  '/demo-script': {
    title: '项目演示脚本 - MFC 通用工具开发训练营',
    description: '生成面试、验收、录屏和 README 可用的 MFC 项目演示流程、讲解词与证据清单。',
  },
  '/delivery': {
    title: '项目交付包 - MFC 通用工具开发训练营',
    description: '汇总学习进度、源码目录、本地实战、验收清单、答辩和演示证据，导出项目交付包。',
  },
  '/submit-rehearsal': {
    title: '项目提交演练 - MFC 通用工具开发训练营',
    description:
      '按真实验收顺序检查 README、源码、编译截图、运行截图、通讯日志、演示稿和答辩记录。',
  },
  '/evidence': {
    title: '证据素材库 - MFC 通用工具开发训练营',
    description: '集中管理最终提交需要的截图、日志、源码、Markdown 和配置文件路径。',
  },
  '/search': {
    title: '全站搜索 - MFC 通用工具开发训练营',
    description: '搜索课程、实验、题目、术语和资源。',
  },
  '/glossary': {
    title: '术语速查 - MFC 通用工具开发训练营',
    description: '集中复习串口、网络、MFC、C++、SQLite/INI 和项目架构术语。',
  },
  '/notes': {
    title: '学习笔记 - MFC 通用工具开发训练营',
    description: '使用浏览器 localStorage 记录模块重点、踩坑和实践结论。',
  },
  '/troubleshooting': {
    title: '故障排查训练 - MFC 通用工具开发训练营',
    description: '通过现场症状、证据、根因和修复步骤训练工程排错能力。',
  },
  '/reports': {
    title: '学习报告 - MFC 通用工具开发训练营',
    description: '汇总学习进度、掌握度、错题和 Capstone 交付建议并导出记录。',
  },
};

function resolveMeta(pathname: string): Meta {
  if (pathname.startsWith('/modules/')) {
    return {
      title: '模块课程页 - MFC 通用工具开发训练营',
      description: '阅读模块目标、核心概念、代码片段、实验入口和本地 MFC 实践建议。',
    };
  }
  return (
    routeMeta[pathname] ?? {
      title: '页面未找到 - MFC 通用工具开发训练营',
      description: '未找到对应页面，请返回首页或学习路线继续学习。',
    }
  );
}

function PageMeta() {
  const location = useLocation();
  useEffect(() => {
    const meta = resolveMeta(location.pathname);
    document.title = meta.title;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (desc) desc.content = meta.description;
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = meta.title;
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = meta.description;
  }, [location.pathname]);
  return null;
}

function LoadingFallback() {
  return (
    <div className="card loading-card" role="status" aria-live="polite">
      <div className="eyebrow">Loading</div>
      <h2>正在加载页面模块…</h2>
      <div className="progress-bar">
        <span style={{ width: '58%' }} />
      </div>
    </div>
  );
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <>
      <PageMeta />
      <Routes>
        <Route
          path="/"
          element={
            <LazyRoute>
              <Home />
            </LazyRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <LazyRoute>
              <Roadmap />
            </LazyRoute>
          }
        />
        <Route
          path="/modules/:moduleId"
          element={
            <LazyRoute>
              <ModulePage />
            </LazyRoute>
          }
        />
        <Route
          path="/labs"
          element={
            <LazyRoute>
              <LabsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <LazyRoute>
              <QuizPage />
            </LazyRoute>
          }
        />
        <Route
          path="/capstone"
          element={
            <LazyRoute>
              <CapstonePage />
            </LazyRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <LazyRoute>
              <PracticePage />
            </LazyRoute>
          }
        />
        <Route
          path="/codegen"
          element={
            <LazyRoute>
              <CodegenPage />
            </LazyRoute>
          }
        />
        <Route
          path="/designer"
          element={
            <LazyRoute>
              <DesignerPage />
            </LazyRoute>
          }
        />
        <Route
          path="/integration"
          element={
            <LazyRoute>
              <IntegrationPage />
            </LazyRoute>
          }
        />
        <Route
          path="/build-checklist"
          element={
            <LazyRoute>
              <BuildChecklistPage />
            </LazyRoute>
          }
        />
        <Route
          path="/comics"
          element={
            <LazyRoute>
              <ComicsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/diagrams"
          element={
            <LazyRoute>
              <DiagramsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/review"
          element={
            <LazyRoute>
              <ReviewPage />
            </LazyRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <LazyRoute>
              <PlannerPage />
            </LazyRoute>
          }
        />
        <Route
          path="/exam"
          element={
            <LazyRoute>
              <ExamPage />
            </LazyRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <LazyRoute>
              <PortfolioPage />
            </LazyRoute>
          }
        />
        <Route
          path="/demo-script"
          element={
            <LazyRoute>
              <DemoScriptPage />
            </LazyRoute>
          }
        />
        <Route
          path="/delivery"
          element={
            <LazyRoute>
              <DeliveryPage />
            </LazyRoute>
          }
        />
        <Route
          path="/submit-rehearsal"
          element={
            <LazyRoute>
              <SubmitRehearsalPage />
            </LazyRoute>
          }
        />
        <Route
          path="/evidence"
          element={
            <LazyRoute>
              <EvidencePage />
            </LazyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <LazyRoute>
              <DashboardPage />
            </LazyRoute>
          }
        />
        <Route
          path="/search"
          element={
            <LazyRoute>
              <SearchPage />
            </LazyRoute>
          }
        />
        <Route
          path="/glossary"
          element={
            <LazyRoute>
              <GlossaryPage />
            </LazyRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <LazyRoute>
              <NotesPage />
            </LazyRoute>
          }
        />
        <Route
          path="/troubleshooting"
          element={
            <LazyRoute>
              <TroubleshootingPage />
            </LazyRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <LazyRoute>
              <ReportsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <LazyRoute>
              <ResourcesPage />
            </LazyRoute>
          }
        />
        <Route
          path="*"
          element={
            <LazyRoute>
              <NotFoundPage />
            </LazyRoute>
          }
        />
      </Routes>
    </>
  );
}

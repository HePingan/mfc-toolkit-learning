import { lazy, type ComponentType } from 'react';

function lazyPage<T extends Record<string, ComponentType<object>>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K,
) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName] as ComponentType<object> };
  });
}

const Home = lazyPage(() => import('../pages/Home'), 'Home');
const Roadmap = lazyPage(() => import('../pages/Roadmap'), 'Roadmap');
const ModulePage = lazyPage(() => import('../pages/ModulePage'), 'ModulePage');
const LabsPage = lazyPage(() => import('../pages/LabsPage'), 'LabsPage');
const QuizPage = lazyPage(() => import('../pages/QuizPage'), 'QuizPage');
const CapstonePage = lazyPage(() => import('../pages/CapstonePage'), 'CapstonePage');
const DashboardPage = lazyPage(() => import('../pages/DashboardPage'), 'DashboardPage');
const CodegenPage = lazyPage(() => import('../pages/CodegenPage'), 'CodegenPage');
const DesignerPage = lazyPage(() => import('../pages/DesignerPage'), 'DesignerPage');
const IntegrationPage = lazyPage(() => import('../pages/IntegrationPage'), 'IntegrationPage');
const BuildChecklistPage = lazyPage(
  () => import('../pages/BuildChecklistPage'),
  'BuildChecklistPage',
);
const ComicsPage = lazyPage(() => import('../pages/ComicsPage'), 'ComicsPage');
const DiagramsPage = lazyPage(() => import('../pages/DiagramsPage'), 'DiagramsPage');
const ReviewPage = lazyPage(() => import('../pages/ReviewPage'), 'ReviewPage');
const PlannerPage = lazyPage(() => import('../pages/PlannerPage'), 'PlannerPage');
const ExamPage = lazyPage(() => import('../pages/ExamPage'), 'ExamPage');
const PortfolioPage = lazyPage(() => import('../pages/PortfolioPage'), 'PortfolioPage');
const DemoScriptPage = lazyPage(() => import('../pages/DemoScriptPage'), 'DemoScriptPage');
const DeliveryPage = lazyPage(() => import('../pages/DeliveryPage'), 'DeliveryPage');
const SubmitRehearsalPage = lazyPage(
  () => import('../pages/SubmitRehearsalPage'),
  'SubmitRehearsalPage',
);
const EvidencePage = lazyPage(() => import('../pages/EvidencePage'), 'EvidencePage');
const SearchPage = lazyPage(() => import('../pages/SearchPage'), 'SearchPage');
const GlossaryPage = lazyPage(() => import('../pages/GlossaryPage'), 'GlossaryPage');
const NotesPage = lazyPage(() => import('../pages/NotesPage'), 'NotesPage');
const ResourcesPage = lazyPage(() => import('../pages/ResourcesPage'), 'ResourcesPage');
const TroubleshootingPage = lazyPage(
  () => import('../pages/TroubleshootingPage'),
  'TroubleshootingPage',
);
const ReportsPage = lazyPage(() => import('../pages/ReportsPage'), 'ReportsPage');
const PracticePage = lazyPage(() => import('../pages/PracticePage'), 'PracticePage');
const NotFoundPage = lazyPage(() => import('../pages/NotFoundPage'), 'NotFoundPage');

export type AppRoute = {
  path: string;
  Component: ComponentType<object>;
};

export const appRoutes: AppRoute[] = [
  { path: '/', Component: Home },
  { path: '/roadmap', Component: Roadmap },
  { path: '/modules/:moduleId', Component: ModulePage },
  { path: '/labs', Component: LabsPage },
  { path: '/quiz', Component: QuizPage },
  { path: '/capstone', Component: CapstonePage },
  { path: '/dashboard', Component: DashboardPage },
  { path: '/codegen', Component: CodegenPage },
  { path: '/designer', Component: DesignerPage },
  { path: '/integration', Component: IntegrationPage },
  { path: '/build-checklist', Component: BuildChecklistPage },
  { path: '/comics', Component: ComicsPage },
  { path: '/diagrams', Component: DiagramsPage },
  { path: '/review', Component: ReviewPage },
  { path: '/planner', Component: PlannerPage },
  { path: '/exam', Component: ExamPage },
  { path: '/portfolio', Component: PortfolioPage },
  { path: '/demo-script', Component: DemoScriptPage },
  { path: '/delivery', Component: DeliveryPage },
  { path: '/submit-rehearsal', Component: SubmitRehearsalPage },
  { path: '/evidence', Component: EvidencePage },
  { path: '/search', Component: SearchPage },
  { path: '/glossary', Component: GlossaryPage },
  { path: '/notes', Component: NotesPage },
  { path: '/resources', Component: ResourcesPage },
  { path: '/troubleshooting', Component: TroubleshootingPage },
  { path: '/reports', Component: ReportsPage },
  { path: '/practice', Component: PracticePage },
  { path: '*', Component: NotFoundPage },
];

export const routePaths = appRoutes.map((route) => route.path);

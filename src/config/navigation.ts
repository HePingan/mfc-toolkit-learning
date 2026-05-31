export type NavLinkConfig = {
  to: string;
  text: string;
  label: string;
  short: string;
  icon: string;
};

export const primaryNavGroups = [
  {
    label: '主线学习',
    links: [
      { to: '/', text: '首页' },
      { to: '/roadmap', text: '路线' },
      { to: '/labs', text: '实验' },
      { to: '/quiz', text: '测验' },
      { to: '/capstone', text: '项目' },
      { to: '/practice', text: '实战' },
    ],
  },
  {
    label: '工程工具',
    links: [
      { to: '/codegen', text: '代码骨架' },
      { to: '/designer', text: '界面设计' },
      { to: '/integration', text: '集成向导' },
      { to: '/build-checklist', text: '构建清单' },
      { to: '/troubleshooting', text: '排错' },
    ],
  },
  {
    label: '复盘交付',
    links: [
      { to: '/diagrams', text: '图解' },
      { to: '/review', text: '复习' },
      { to: '/planner', text: '计划' },
      { to: '/exam', text: '答辩' },
      { to: '/portfolio', text: '作品集' },
      { to: '/demo-script', text: '演示稿' },
      { to: '/delivery', text: '交付包' },
      { to: '/submit-rehearsal', text: '提交演练' },
      { to: '/evidence', text: '证据库' },
      { to: '/reports', text: '报告' },
    ],
  },
  {
    label: '资料中心',
    links: [
      { to: '/dashboard', text: '仪表盘' },
      { to: '/search', text: '搜索' },
      { to: '/glossary', text: '术语' },
      { to: '/notes', text: '笔记' },
      { to: '/resources', text: '资源' },
      { to: '/comics', text: '知识漫画' },
    ],
  },
] as const;

export const toolLinks: NavLinkConfig[] = [
  { to: '/search', icon: '🔎', short: '搜索', label: '全站搜索', text: '搜索' },
  { to: '/glossary', icon: '📘', short: '术语', label: '术语表', text: '术语' },
  { to: '/notes', icon: '📝', short: '笔记', label: '学习笔记', text: '笔记' },
  { to: '/troubleshooting', icon: '🧯', short: '排错', label: '故障排查', text: '排错' },
  { to: '/reports', icon: '📦', short: '报告', label: '学习报告', text: '报告' },
  { to: '/delivery', icon: '🧾', short: '交付', label: '项目交付包', text: '交付' },
  { to: '/submit-rehearsal', icon: '📋', short: '提交', label: '提交演练', text: '提交' },
  { to: '/evidence', icon: '🗂️', short: '证据', label: '证据素材库', text: '证据' },
  { to: '/codegen', icon: '🧱', short: '代码', label: '代码骨架', text: '代码' },
  { to: '/designer', icon: '🎛️', short: '界面', label: '界面设计', text: '界面' },
  { to: '/integration', icon: '🧩', short: '集成', label: '集成向导', text: '集成' },
  { to: '/build-checklist', icon: '✅', short: '清单', label: '构建清单', text: '清单' },
  { to: '/comics', icon: '🎨', short: '漫画', label: '知识漫画', text: '漫画' },
  { to: '/diagrams', icon: '🗺️', short: '图解', label: '图解中心', text: '图解' },
  { to: '/review', icon: '🧠', short: '复习', label: '复习训练', text: '复习' },
  { to: '/planner', icon: '📅', short: '计划', label: '学习计划', text: '计划' },
  { to: '/portfolio', icon: '💼', short: '作品', label: '作品集', text: '作品' },
  { to: '/demo-script', icon: '🎬', short: '演示', label: '演示稿', text: '演示' },
];

export const homeToolShortcuts = toolLinks.filter(
  (link) =>
    ![
      '/delivery',
      '/submit-rehearsal',
      '/evidence',
      '/review',
      '/planner',
      '/portfolio',
      '/demo-script',
    ].includes(link.to),
);

export const bottomTabs = [
  { to: '/', icon: '⌂', label: '首页' },
  { to: '/dashboard', icon: '◎', label: '闭环' },
  { to: '/review', icon: '↺', label: '复习' },
  { to: '/exam', icon: '✓', label: '答辩' },
  { to: '/evidence', icon: '▣', label: '证据' },
] as const;

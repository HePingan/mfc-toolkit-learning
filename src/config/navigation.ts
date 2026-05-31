export type NavLinkConfig = {
  to: string;
  text: string;
  label: string;
  short: string;
  icon: string;
};

export type BasicNavLink = {
  to: string;
  text: string;
  label?: string;
  tone?: 'primary' | 'ghost';
};

export type NavGroup = {
  label: string;
  links: NavLinkConfig[];
};

export const mainHeaderNav: BasicNavLink[] = [
  { to: '/', text: '首页' },
  { to: '/roadmap', text: '路线' },
  { to: '/labs', text: '实验' },
  { to: '/capstone', text: '项目' },
  { to: '/dashboard', text: '仪表盘' },
];

export const learningLinks: NavLinkConfig[] = [
  { to: '/roadmap', icon: '🧭', short: '路线', label: '学习路线', text: '路线' },
  { to: '/labs', icon: '🧪', short: '实验', label: '实验中心', text: '实验' },
  { to: '/quiz', icon: '📝', short: '测验', label: '测验中心', text: '测验' },
  { to: '/practice', icon: '🧰', short: '实战', label: '本地实战', text: '实战' },
  { to: '/review', icon: '🧠', short: '复习', label: '复习训练', text: '复习' },
  { to: '/planner', icon: '📅', short: '计划', label: '学习计划', text: '计划' },
  { to: '/exam', icon: '🎤', short: '答辩', label: '答辩训练', text: '答辩' },
];

export const engineeringLinks: NavLinkConfig[] = [
  { to: '/codegen', icon: '🧱', short: '代码', label: '代码骨架', text: '代码' },
  { to: '/designer', icon: '🎛️', short: '界面', label: '界面设计', text: '界面' },
  { to: '/integration', icon: '🧩', short: '集成', label: '集成向导', text: '集成' },
  { to: '/build-checklist', icon: '✅', short: '清单', label: '构建清单', text: '清单' },
  { to: '/troubleshooting', icon: '🧯', short: '排错', label: '故障排查', text: '排错' },
  { to: '/diagrams', icon: '🗺️', short: '图解', label: '图解中心', text: '图解' },
];

export const deliveryLinks: NavLinkConfig[] = [
  { to: '/portfolio', icon: '💼', short: '作品', label: '作品集', text: '作品' },
  { to: '/demo-script', icon: '🎬', short: '演示', label: '演示稿', text: '演示' },
  { to: '/delivery', icon: '🧾', short: '交付', label: '项目交付包', text: '交付' },
  { to: '/submit-rehearsal', icon: '📋', short: '提交', label: '提交演练', text: '提交' },
  { to: '/evidence', icon: '🗂️', short: '证据', label: '证据素材库', text: '证据' },
  { to: '/reports', icon: '📦', short: '报告', label: '学习报告', text: '报告' },
];

export const resourceLinks: NavLinkConfig[] = [
  { to: '/dashboard', icon: '◎', short: '仪表', label: '学习仪表盘', text: '仪表盘' },
  { to: '/search', icon: '🔎', short: '搜索', label: '全站搜索', text: '搜索' },
  { to: '/glossary', icon: '📘', short: '术语', label: '术语表', text: '术语' },
  { to: '/notes', icon: '🗒️', short: '笔记', label: '学习笔记', text: '笔记' },
  { to: '/resources', icon: '📚', short: '资源', label: '资源中心', text: '资源' },
  { to: '/comics', icon: '🎨', short: '漫画', label: '知识漫画', text: '漫画' },
];

export const toolNavGroups: NavGroup[] = [
  { label: '学习', links: learningLinks },
  { label: '工程', links: engineeringLinks },
  { label: '交付', links: deliveryLinks },
  { label: '资料', links: resourceLinks },
];

export const toolLinks: NavLinkConfig[] = toolNavGroups.flatMap((group) => group.links);

export const homePrimaryActions: BasicNavLink[] = [
  { to: '/modules/overview', text: '开始学习', label: '开始学习', tone: 'primary' },
  { to: '/roadmap', text: '学习路线', label: '学习路线' },
  { to: '/labs', text: '进入实验室', label: '进入实验室' },
  { to: '/practice', text: '本地实战', label: '本地实战' },
];

export const homeToolShortcuts: NavLinkConfig[] = [
  resourceLinks[1],
  resourceLinks[2],
  resourceLinks[3],
  engineeringLinks[4],
  deliveryLinks[5],
  engineeringLinks[0],
  engineeringLinks[1],
  engineeringLinks[2],
];

export const bottomTabs = [
  { to: '/', icon: '⌂', label: '首页' },
  { to: '/labs', icon: '◇', label: '实验' },
  { to: '/dashboard', icon: '◎', label: '仪表' },
  { to: '/review', icon: '↺', label: '复习' },
  { to: '/evidence', icon: '▣', label: '证据' },
] as const;

export const primaryNavGroups = toolNavGroups;

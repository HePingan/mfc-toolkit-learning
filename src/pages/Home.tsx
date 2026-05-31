import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { ModuleCard } from '../components/course/ModuleCard';
import { useProgress } from '../hooks/useProgress';
import { labs } from '../data/labs';
import { quizzes } from '../data/quizzes';
import { homeToolShortcuts } from '../config/navigation';

const valuePoints = [
  '不只是学语法，而是把串口、网络、数据保存整合成工具',
  '不只是看概念，而是用交互实验把协议帧、内存、消息映射跑一遍',
  '不只是做题，而是沉淀错题本、掌握度和最终项目验收清单',
];

const quickActions = [
  { to: '/modules/overview', label: '开始学习', tone: 'primary' },
  { to: '/roadmap', label: '学习路线' },
  { to: '/labs', label: '进入实验室' },
  { to: '/practice', label: '本地实战' },
];

const featureGroups = [
  {
    title: '工程落地',
    desc: '从浏览器练习迁移到 Visual Studio / MFC 本地项目。',
    links: [
      { to: '/codegen', label: '代码骨架' },
      { to: '/designer', label: '界面设计' },
      { to: '/integration', label: '集成向导' },
      { to: '/build-checklist', label: '构建清单' },
      { to: '/troubleshooting', label: '故障排查' },
    ],
  },
  {
    title: '复习提升',
    desc: '把题库、术语、错题和图解串成可持续复盘。',
    links: [
      { to: '/review', label: '复习训练' },
      { to: '/planner', label: '学习计划' },
      { to: '/exam', label: '答辩训练' },
      { to: '/diagrams', label: '图解中心' },
      { to: '/glossary', label: '术语速查' },
    ],
  },
  {
    title: '交付资料',
    desc: '整理学习记录、作品集、演示稿和项目证明材料。',
    links: [
      { to: '/portfolio', label: '作品集' },
      { to: '/demo-script', label: '演示稿' },
      { to: '/reports', label: '学习报告' },
      { to: '/dashboard', label: '仪表盘' },
      { to: '/notes', label: '学习笔记' },
      { to: '/search', label: '全站搜索' },
      { to: '/resources', label: '资源中心' },
      { to: '/comics', label: '知识漫画' },
    ],
  },
];

const updates = [
  '全站搜索、术语表、笔记、排错训练和学习报告已经整合到移动端功能中心。',
  '代码骨架、界面设计、集成向导、构建清单可直接支持本地 MFC 项目迁移。',
  '复习训练、学习计划、答辩、作品集和演示稿用于最后验收与面试展示。',
];

export function Home() {
  const { overallPercent, progress } = useProgress();
  const stats = [
    { label: '课程模块', value: modules.length, note: '从环境到综合项目' },
    { label: '交互实验', value: labs.length, note: '浏览器内模拟关键概念' },
    { label: '测验题库', value: quizzes.length, note: '每模块 12 题，含单选/多选/判断/代码/场景' },
    { label: '当前进度', value: `${overallPercent}%`, note: `已完成 ${progress.completedModules.length} 个模块` },
  ];
  const nextModule = modules.find((module) => !progress.completedModules.includes(module.id)) ?? modules[0];
  const androidTools = homeToolShortcuts.slice(0, 4);

  return (
    <div>
      <section className="hero hero-grid">
        <div>
          <div className="eyebrow">C++ / MFC / Serial / TCP Socket / HTTP / SQLite / INI / 多线程</div>
          <h2>MFC 通用工具开发训练营</h2>
          <p>从串口、TCP、HTTP 到 SQLite/INI，用 C++ 和 MFC 构建一个真正能用的工业通信调试工具。</p>
          <div className="home-quick-actions">
            {quickActions.map((action) => (
              <Link
                className={`button ${action.tone === 'primary' ? 'button-primary' : 'button-ghost'}`}
                to={action.to}
                key={action.to}
              >
                {action.label}
              </Link>
            ))}
          </div>
          <div className="badge-list">
            {['深色工程风', '浏览器模拟', 'localStorage 进度', '最终项目验收'].map((item) => <span className="badge" key={item}>{item}</span>)}
          </div>
        </div>
        <div className="hero-console terminal">
          <div><span>$</span> create MFC Toolkit Learning Path</div>
          {valuePoints.map((item) => <div key={item}><span>✓</span> {item}</div>)}
          <div><span>→</span> 下一步：按路线完成模块、实验、测验和 Capstone 自评</div>
          {updates.map((item) => <div key={item}><span>✦</span> {item}</div>)}
        </div>
      </section>

      <section className="android-home-card">
        <div>
          <div className="eyebrow">Android Learning</div>
          <h2>MFC 通用工具开发</h2>
          <p>继续：{nextModule.title}</p>
        </div>
        <div className="android-progress-mini">
          <span>总进度 {overallPercent}%</span>
          <div className="progress-bar"><i style={{ width: `${overallPercent}%` }} /></div>
        </div>
        <div className="android-home-actions">
          <Link className="button button-primary" to={`/modules/${nextModule.id}`}>继续学习</Link>
          <Link className="button button-ghost" to="/labs">进入实验</Link>
        </div>
      </section>

      <section className="android-tool-chips" aria-label="安卓快捷工具">
        {androidTools.map((tool) => <Link to={tool.to} key={tool.to}>{tool.short}</Link>)}
        <Link to="/dashboard">更多</Link>
      </section>

      <section className="mobile-tool-strip" aria-label="快捷工具">
        <div className="tool-strip-head">
          <strong>快捷工具</strong>
          <span>横向滑动</span>
        </div>
        <div className="tool-strip-scroll">
          {homeToolShortcuts.map((tool) => (
            <Link className="tool-chip" to={tool.to} key={tool.to} aria-label={tool.label}>
              <span>{tool.icon}</span>
              <b>{tool.short}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="stat-grid compact-stats">
        {stats.map((item) => (
          <div className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <p>{item.note}</p>
          </div>
        ))}
      </section>

      <section className="section-head">
        <div>
          <div className="eyebrow">Learning Path</div>
          <h2>按“工具开发”顺序学习</h2>
          <p className="muted">先理解工具全貌，再逐步拆解串口、网络、MFC、C++ 核心、数据存储，最后回到完整项目。</p>
        </div>
        <Link className="button button-ghost" to="/capstone">查看最终项目</Link>
      </section>
      <section className="android-module-list" aria-label="安卓课程模块列表">
        {modules.map((module, index) => (
          <Link className="android-module-row" to={`/modules/${module.id}`} key={module.id}>
            <span className="android-module-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="android-module-icon">{module.icon}</span>
            <span className="android-module-main">
              <strong>{module.title}</strong>
              <em>{module.subtitle}</em>
            </span>
            <span className="android-module-meta">{module.estimatedMinutes}分 ›</span>
          </Link>
        ))}
      </section>
      <section className="card-grid desktop-module-grid">{modules.map((module) => <ModuleCard key={module.id} module={module} />)}</section>

      <details className="feature-center feature-center-collapsed">
        <summary>更多工具与交付能力</summary>
        <p className="muted feature-center-note">完整入口默认折叠，避免移动端首页被工具区占满。</p>
        <div className="feature-group-grid">
          {featureGroups.map((group) => (
            <article className="card feature-group-card" key={group.title}>
              <h3>{group.title}</h3>
              <p className="muted">{group.desc}</p>
              <div className="feature-link-list">
                {group.links.map((link) => (
                  <Link to={link.to} key={link.to}>{link.label}</Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </details>
    </div>
  );
}

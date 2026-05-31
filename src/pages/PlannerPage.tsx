import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { quizzes } from '../data/quizzes';
import { useProgress } from '../hooks/useProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { masteryScore, unique } from '../utils/progress';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type PlanMode = '7days' | '14days' | '30days';
type PlannerState = {
  mode: PlanMode;
  focus: 'balanced' | 'weak' | 'local';
  completedPlanItems: string[];
};

type PlanItem = {
  id: string;
  day: number;
  title: string;
  detail: string;
  moduleId?: string;
  route: string;
  kind: '课程' | '实验' | '测验' | '本地实战' | '复习' | '交付';
};

const modeDays: Record<PlanMode, number> = { '7days': 7, '14days': 14, '30days': 30 };

function moduleTasks(moduleId: string, day: number): PlanItem[] {
  const module = modules.find((item) => item.id === moduleId);
  if (!module) return [];
  const moduleLabs = labs.filter((lab) => lab.moduleId === module.id);
  return [
    {
      id: `${day}-${module.id}-course`,
      day,
      title: `阅读：${module.title}`,
      detail: `${module.chapterSummary ?? module.description} 重点关注：${module.concepts.slice(0, 4).join('、')}`,
      moduleId: module.id,
      route: `/modules/${module.id}`,
      kind: '课程',
    },
    ...moduleLabs.slice(0, 2).map((lab, index) => ({
      id: `${day}-${lab.id}`,
      day,
      title: `实验：${lab.title}`,
      detail: `${lab.summary} 本地迁移目标：${lab.localMfc.goal}`,
      moduleId: module.id,
      route: '/labs',
      kind: '实验' as const,
    })).map((item, index) => ({ ...item, day: day + index })),
    {
      id: `${day}-${module.id}-quiz`,
      day: day + 1,
      title: `测验：${module.title}`,
      detail: `完成 ${quizzes.filter((q) => q.moduleId === module.id).length} 道题，错题进入 /review 翻面复习。`,
      moduleId: module.id,
      route: '/quiz',
      kind: '测验',
    },
  ];
}

function buildPlan(mode: PlanMode, focus: PlannerState['focus'], weakIds: string[]): PlanItem[] {
  const days = modeDays[mode];
  const baseOrder = focus === 'weak' && weakIds.length ? unique([...weakIds, ...modules.map((m) => m.id)]) : modules.map((m) => m.id);
  const items: PlanItem[] = [];
  baseOrder.forEach((id, index) => {
    const start = 1 + Math.floor(index * Math.max(1, days - 3) / Math.max(1, baseOrder.length));
    items.push(...moduleTasks(id, start));
  });
  if (focus === 'local') {
    items.push(
      { id: 'local-codegen', day: Math.max(2, Math.floor(days * 0.45)), title: '生成 MFC Mini Project 包', detail: '在代码骨架页选择 Serial/TCP/HTTP/SQLite/Logger/WorkerThread，下载 ZIP 后按集成向导接入 Visual Studio。', route: '/codegen', kind: '本地实战' },
      { id: 'local-designer', day: Math.max(3, Math.floor(days * 0.55)), title: '规划 Dialog 控件与 Message Map', detail: '用界面设计器确认控件 ID、按钮事件、资源草图，再回到本地 MFC Dialog。', route: '/designer', kind: '本地实战' },
      { id: 'local-build', day: Math.max(4, Math.floor(days * 0.7)), title: '执行 Visual Studio 构建清单', detail: '按项目创建、文件导入、属性页、编译链接、运行验收阶段逐项打勾。', route: '/build-checklist', kind: '本地实战' },
    );
  }
  items.push(
    { id: 'review-loop', day: Math.max(2, Math.floor(days * 0.62)), title: '错题与术语复习闭环', detail: '打开复习训练台，按薄弱模块筛选卡片，先回忆再翻面，必要时标记稍后复习。', route: '/review', kind: '复习' },
    { id: 'trouble-loop', day: Math.max(3, Math.floor(days * 0.72)), title: '现场故障排查训练', detail: '至少完成串口、TCP、MFC 消息映射、SQLite/INI 四类排错案例。', route: '/troubleshooting', kind: '复习' },
    { id: 'exam-loop', day: Math.max(4, Math.floor(days * 0.82)), title: '随机答辩训练', detail: '进入答辩训练场随机抽题，补充回答和证据记录，优先完成未演练题。', route: '/exam', kind: '交付' },
    { id: 'portfolio-loop', day: Math.max(5, Math.floor(days * 0.9)), title: '整理作品集材料', detail: '把学习进度、本地实战、Capstone 证据整理成 README、简历和项目作品集素材。', route: '/portfolio', kind: '交付' },
    { id: 'demo-loop', day: days, title: '完成项目演示稿与彩排', detail: '生成 3/5/10/15 分钟演示稿，补齐证据缺口并完成至少一次彩排。', route: '/demo-script', kind: '交付' },
    { id: 'final-report', day: days, title: '导出学习报告与交付包', detail: '汇总进度、掌握度、错题、Capstone 建议，导出 Markdown/JSON 做阶段复盘。', route: '/reports', kind: '交付' },
  );
  return items
    .map((item) => ({ ...item, day: Math.min(days, Math.max(1, item.day)) }))
    .sort((a, b) => a.day - b.day || a.title.localeCompare(b.title, 'zh-CN'));
}

function exportMarkdown(items: PlanItem[], days: number) {
  const byDay = Array.from({ length: days }, (_, index) => index + 1).map((day) => ({ day, items: items.filter((item) => item.day === day) }));
  return `# MFC 训练营学习计划\n\n${byDay.map((row) => `## Day ${row.day}\n${row.items.length ? row.items.map((item) => `- [ ] ${item.kind}：${item.title}\n  - ${item.detail}\n  - 路由：${item.route}\n  - 今日证据收集：截图、源码路径、运行日志或导出 Markdown`).join('\n') : '- [ ] 机动复盘：整理笔记、补错题、回看图解中心'}`).join('\n\n')}`;
}

export function PlannerPage() {
  const { progress, overallPercent } = useProgress();
  const [state, setState] = useLocalStorage<PlannerState>(storageKeys.planner, { mode: '14days', focus: 'balanced', completedPlanItems: [] });
  const [activeDay, setActiveDay] = useState(1);
  const weakRows = modules.map((module) => ({ module, score: masteryScore(module.id, progress) })).filter((row) => row.score < 70);
  const days = modeDays[state.mode];
  const planItems = useMemo(() => buildPlan(state.mode, state.focus, weakRows.map((row) => row.module.id)), [state.mode, state.focus, progress]);
  const visibleItems = planItems.filter((item) => item.day === activeDay);
  const todayItems = visibleItems;
  const doneCount = planItems.filter((item) => state.completedPlanItems.includes(item.id)).length;
  const planPercent = planItems.length ? Math.round(doneCount / planItems.length * 100) : 0;

  const toggleItem = (id: string) => {
    const next = state.completedPlanItems.includes(id)
      ? state.completedPlanItems.filter((item) => item !== id)
      : unique([...state.completedPlanItems, id]);
    setState({ ...state, completedPlanItems: next });
  };

  const setMode = (mode: PlanMode) => setState({ ...state, mode, completedPlanItems: [] });
  const setFocus = (focus: PlannerState['focus']) => setState({ ...state, focus, completedPlanItems: [] });

  return (
    <div>
      <section className="hero planner-hero">
        <div className="eyebrow">Study Planner · Local MFC Roadmap</div>
        <h2>学习计划生成器</h2>
        <p>根据当前进度、薄弱模块和目标节奏，把课程、实验、测验、复习、本地 MFC 实战和报告导出串成一张可执行计划表。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/dashboard">查看仪表盘</Link>
          <Link className="button button-ghost" to="/review">复习训练</Link>
          <Link className="button button-ghost" to="/build-checklist">构建清单</Link>
          <Link className="button button-ghost" to="/reports">学习报告</Link>
        </div>
      </section>

      <section className="planner-summary-grid">
        <Card><strong>{overallPercent}%</strong><span>全站进度</span><p className="muted">来自模块、实验、测验综合计算</p></Card>
        <Card><strong>{weakRows.length}</strong><span>薄弱模块</span><p className="muted">掌握度低于 70%</p></Card>
        <Card><strong>{days}</strong><span>计划天数</span><p className="muted">可切换 7/14/30 天</p></Card>
        <Card><strong>{planPercent}%</strong><span>计划完成</span><p className="muted">保存在浏览器 localStorage</p></Card>
      </section>


      <Card className="planner-today-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Learning loop v4</div><h3>今日任务</h3></div>
          <span className="badge">Day {activeDay} · {todayItems.length || '机动'} 项</span>
        </div>
        <p className="muted">今天建议按“学习/实验 → 复习 → 答辩/演示证据”的顺序推进，最后把截图、日志、源码路径写进交付材料。</p>
        <div className="planner-today-actions">
          <Link className="button button-ghost" to="/review">复习训练</Link>
          <Link className="button button-ghost" to="/exam">答辩训练</Link>
          <Link className="button button-ghost" to="/portfolio">作品集</Link>
          <Link className="button button-ghost" to="/demo-script">演示稿</Link>
        </div>
      </Card>

      <Card className="planner-control-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Plan Options</div><h3>计划参数</h3></div>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-study-plan.md', exportMarkdown(planItems, days))}>导出 Markdown</Button>
        </div>
        <div className="planner-options">
          <label>节奏
            <select value={state.mode} onChange={(event) => setMode(event.target.value as PlanMode)}>
              <option value="7days">7 天冲刺</option>
              <option value="14days">14 天稳步推进</option>
              <option value="30days">30 天完整训练</option>
            </select>
          </label>
          <label>重点
            <select value={state.focus} onChange={(event) => setFocus(event.target.value as PlannerState['focus'])}>
              <option value="balanced">均衡学习</option>
              <option value="weak">优先薄弱模块</option>
              <option value="local">优先本地 MFC 落地</option>
            </select>
          </label>
        </div>
        {weakRows.length > 0 && <div className="badge-list">{weakRows.map((row) => <span className="badge badge-warning" key={row.module.id}>{row.module.title} · {row.score}%</span>)}</div>}
      </Card>

      <section className="planner-days">
        {Array.from({ length: days }, (_, index) => index + 1).map((day) => {
          const dayItems = planItems.filter((item) => item.day === day);
          const complete = dayItems.length > 0 && dayItems.every((item) => state.completedPlanItems.includes(item.id));
          return <button className={activeDay === day ? 'active' : complete ? 'done' : ''} key={day} onClick={() => setActiveDay(day)}>Day {day}<small>{dayItems.length} 项</small></button>;
        })}
      </section>

      <section className="planner-item-grid">
        {visibleItems.length ? visibleItems.map((item) => {
          const done = state.completedPlanItems.includes(item.id);
          return (
            <Card className={done ? 'planner-item done' : 'planner-item'} key={item.id}>
              <div className="planner-item-head">
                <span className="badge">{item.kind}</span>
                {item.moduleId && <span className="badge">{modules.find((module) => module.id === item.moduleId)?.title}</span>}
              </div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <div className="form-row">
                <Button onClick={() => toggleItem(item.id)}>{done ? '取消完成' : '标记完成'}</Button>
                <Link className="button button-ghost" to={item.route}>打开任务页面</Link>
              </div>
            </Card>
          );
        }) : <Card><p className="muted">今天为机动日：整理笔记、补错题、回看图解中心，或在 Visual Studio 中继续本地调试。</p></Card>}
      </section>

      <Card className="planner-boundary-card">
        <div className="eyebrow">Browser-only Boundary</div>
        <h3>计划页只做学习编排</h3>
        <p>这里不会连接真实串口、不会编译 MFC、不会访问 TCP/SQLite。计划中的本地实战任务需要在 Windows + Visual Studio + MFC 环境中完成，网页负责安排路径、保存勾选和导出清单。</p>
      </Card>
    </div>
  );
}

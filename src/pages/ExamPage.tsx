import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { capstoneRubric, practiceTemplates } from '../data/practice';
import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type DrillLevel = '基础' | '进阶' | '项目验收';
type DrillItem = {
  id: string;
  level: DrillLevel;
  category: string;
  title: string;
  prompt: string;
  expected: string[];
  route: string;
};

type ExamState = {
  completed: string[];
  notes: Record<string, string>;
};

function buildDrills(): DrillItem[] {
  const moduleDrills = modules.map((module): DrillItem => ({
    id: `module-${module.id}`,
    level: '基础',
    category: module.title,
    title: `${module.title} 口述检查`,
    prompt: `不用看资料，说明本模块在 MFC 通用调试工具中的作用，并列出 2 个常见踩坑。`,
    expected: [module.description, `核心概念：${module.concepts.slice(0, 5).join('、')}`, `常见错误：${module.commonMistakes.slice(0, 3).join('；')}`],
    route: `/modules/${module.id}`,
  }));

  const labDrills = labs.slice(0, 10).map((lab): DrillItem => ({
    id: `lab-${lab.id}`,
    level: lab.level === '完整版' ? '进阶' : '基础',
    category: modules.find((module) => module.id === lab.moduleId)?.title ?? lab.moduleId,
    title: `${lab.title} 迁移检查`,
    prompt: `把浏览器实验迁移到本地 MFC 时，你会新增哪些控件、文件和验收点？`,
    expected: [`实验目标：${lab.summary}`, `本地目标：${lab.localMfc.goal}`, `控件：${lab.localMfc.controls.slice(0, 4).join('、')}`, `验收：${lab.localMfc.acceptance.slice(0, 3).join('；')}`],
    route: '/labs',
  }));

  const practiceDrills = practiceTemplates.map((item): DrillItem => ({
    id: `practice-${item.id}`,
    level: '进阶',
    category: item.stage,
    title: `${item.title} 实战问答`,
    prompt: `如果让你在 Visual Studio 中落地“${item.title}”，先改哪些文件？如何证明它不是只停留在界面？`,
    expected: [`目标：${item.goal}`, `文件：${item.files.join('、')}`, `步骤：${item.steps.slice(0, 4).join('；')}`, `验收：${item.checks.slice(0, 4).join('；')}`],
    route: '/practice',
  }));

  const rubricDrills = capstoneRubric.map((item): DrillItem => ({
    id: `rubric-${item.item}`,
    level: '项目验收',
    category: 'Capstone',
    title: `${item.item} 验收答辩`,
    prompt: `面试/答辩时如何证明你的项目满足“${item.item}”？给出证据、截图或日志。`,
    expected: [`权重：${item.score} 分`, `验收说明：${item.detail}`, '证据建议：界面截图、日志片段、构建结果、导出报告或故障复现记录。'],
    route: '/capstone',
  }));

  return [...moduleDrills, ...labDrills, ...practiceDrills, ...rubricDrills];
}

function exportExamMarkdown(items: DrillItem[], state: ExamState) {
  return `# MFC 训练营面试 / 答辩训练记录\n\n${items.map((item, index) => `## ${index + 1}. ${item.title}\n\n- 等级：${item.level}\n- 分类：${item.category}\n- 完成：${state.completed.includes(item.id) ? '是' : '否'}\n\n### 题目\n${item.prompt}\n\n### 参考要点\n${item.expected.map((line) => `- ${line}`).join('\n')}\n\n### 我的回答\n${state.notes[item.id] || '（未填写）'}`).join('\n\n')}`;
}

export function ExamPage() {
  const allItems = useMemo(buildDrills, []);
  const [state, setState] = useLocalStorage<ExamState>(storageKeys.exam, { completed: [], notes: {} });
  const [level, setLevel] = useState<'全部' | DrillLevel>('全部');
  const [category, setCategory] = useState('全部');
  const [activeId, setActiveId] = useState(allItems[0]?.id ?? '');
  const [focusMode, setFocusMode] = useState(false);
  const categories = ['全部', ...Array.from(new Set(allItems.map((item) => item.category)))];
  const items = allItems.filter((item) => (level === '全部' || item.level === level) && (category === '全部' || item.category === category));
  const active = items.find((item) => item.id === activeId) ?? items[0] ?? allItems[0];
  const doneCount = allItems.filter((item) => state.completed.includes(item.id)).length;
  const undoneCount = allItems.length - doneCount;
  const percent = Math.round(doneCount / allItems.length * 100);

  const toggleDone = (id: string) => {
    const completed = state.completed.includes(id) ? state.completed.filter((item) => item !== id) : [...state.completed, id];
    setState({ ...state, completed });
  };

  const setNote = (id: string, value: string) => setState({ ...state, notes: { ...state.notes, [id]: value } });
  const pickFrom = (pool: DrillItem[]) => {
    if (!pool.length) return;
    const target = pool[Math.floor(Math.random() * pool.length)];
    setActiveId(target.id);
  };
  const pickRandom = () => pickFrom(items.length ? items : allItems);
  const pickUnfinished = () => {
    const pool = items.filter((item) => !state.completed.includes(item.id));
    pickFrom(pool.length ? pool : items);
  };
  const nextQuestion = () => {
    const pool = items.length ? items : allItems;
    const currentIndex = Math.max(0, pool.findIndex((item) => item.id === active?.id));
    setActiveId(pool[(currentIndex + 1) % pool.length]?.id ?? '');
  };

  return (
    <div>
      <section className="hero exam-hero">
        <div className="eyebrow">Interview Drill · Project Defense</div>
        <h2>面试 / 答辩训练场</h2>
        <p>把课程模块、浏览器实验、本地 MFC 实战模板和 Capstone 评分项转成“能不能讲清楚、能不能拿出证据”的训练题。适合面试前、项目验收前集中演练。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/capstone">查看最终项目</Link>
          <Link className="button button-ghost" to="/practice">本地实战证据</Link>
          <Link className="button button-ghost" to="/reports">导出学习报告</Link>
          <Link className="button button-ghost" to="/planner">学习计划</Link>
        </div>
      </section>

      <section className="exam-summary-grid">
        <Card><strong>{allItems.length}</strong><span>训练题</span><p className="muted">覆盖模块、实验、实战和验收</p></Card>
        <Card><strong>{percent}%</strong><span>完成度</span><p className="muted">答辩训练记录保存在本地</p></Card>
        <Card><strong>{capstoneRubric.length}</strong><span>验收项</span><p className="muted">对应 Capstone 评分维度</p></Card>
        <Card><strong>{practiceTemplates.length}</strong><span>实战模板</span><p className="muted">用于准备项目证据</p></Card>
        <Card><strong>{undoneCount}</strong><span>未完成题</span><p className="muted">可用随机抽题优先训练</p></Card>
      </section>

      <Card className="exam-control-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Drill Scope</div><h3>筛选训练题</h3></div>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-exam-defense-drills.md', exportExamMarkdown(allItems, state))}>导出答辩记录</Button>
        </div>
        <div className="exam-random-actions">
          <Button onClick={pickRandom}>随机抽题</Button>
          <Button className="button-ghost" onClick={nextQuestion}>下一题</Button>
          <Button className="button-ghost" onClick={pickUnfinished}>只抽未完成</Button>
          <Button className="button-ghost" onClick={() => setFocusMode((value) => !value)}>{focusMode ? '显示题库' : '专注答题'}</Button>
        </div>
        <div className="exam-filter-grid">
          <label>等级
            <select value={level} onChange={(event) => { setLevel(event.target.value as typeof level); setActiveId(''); }}>
              <option value="全部">全部</option>
              <option value="基础">基础</option>
              <option value="进阶">进阶</option>
              <option value="项目验收">项目验收</option>
            </select>
          </label>
          <label>分类
            <select value={category} onChange={(event) => { setCategory(event.target.value); setActiveId(''); }}>
              {categories.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <section className={`exam-layout ${focusMode ? 'focus-mode' : ''}`}>
        {!focusMode && <Card className="exam-list-card">
          <div className="eyebrow">Question List</div>
          {items.map((item) => <button className={active?.id === item.id ? 'active' : state.completed.includes(item.id) ? 'done' : ''} key={item.id} onClick={() => setActiveId(item.id)}><span>{item.title}</span><small>{item.level} · {item.category}</small></button>)}
        </Card>}

        {active && <Card className="exam-drill-card">
          <div className="diagram-head compact-head">
            <div><div className="eyebrow">{active.level} · {active.category}</div><h3>{active.title}</h3></div>
            <span className="badge">{state.completed.includes(active.id) ? '已完成' : '待演练'}</span>
          </div>
          <div className="exam-prompt"><strong>题目</strong><p>{active.prompt}</p></div>
          <div className="exam-expected"><strong>参考要点</strong><ul>{active.expected.map((line) => <li key={line}>{line}</li>)}</ul></div>
          <label className="exam-answer-box">我的回答 / 证据记录
            <textarea value={state.notes[active.id] ?? ''} onChange={(event) => setNote(active.id, event.target.value)} placeholder="例如：我会展示 Visual Studio 编译截图、日志窗口、导出的报告，以及对应源码文件…" rows={7} />
          </label>
          <div className="form-row">
            <Button onClick={() => toggleDone(active.id)}>{state.completed.includes(active.id) ? '取消完成' : '标记已演练'}</Button>
            <Link className="button button-ghost" to={active.route}>打开关联页面</Link>
          </div>
        </Card>}
      </section>

      <Card className="exam-boundary-card">
        <div className="eyebrow">Defense Boundary</div>
        <h3>答辩训练不替代真实本地证明</h3>
        <p>网页只帮助你整理问答、参考要点和证据清单。真正能用于面试或项目验收的材料，应来自 Windows + Visual Studio + MFC 本地项目：编译结果、运行截图、串口/TCP/SQLite 日志、源码提交和报告导出。</p>
      </Card>
    </div>
  );
}

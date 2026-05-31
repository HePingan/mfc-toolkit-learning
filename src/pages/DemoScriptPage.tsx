import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { capstoneRubric, practiceTemplates, recommendedProjectFiles } from '../data/practice';
import { modules } from '../data/modules';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type DemoMode = '3min' | '5min' | '10min' | '15min';
type DemoState = {
  mode: DemoMode;
  projectName: string;
  audience: string;
  customEvidence: Record<string, string>;
  rehearsalNotes: Record<string, string>;
  completed: string[];
};

type DemoStep = {
  id: string;
  title: string;
  minutes: number;
  talk: string;
  show: string[];
  evidence: string[];
  route: string;
};

const modeOptions: Array<{ id: DemoMode; label: string; minutes: number; focus: string }> = [
  { id: '3min', label: '3 分钟快速版', minutes: 3, focus: '只讲目标、架构、1 个核心模块和结果。' },
  {
    id: '5min',
    label: '5 分钟面试版',
    minutes: 5,
    focus: '讲清技术选型、模块拆分、稳定性和个人贡献。',
  },
  {
    id: '10min',
    label: '10 分钟项目验收版',
    minutes: 10,
    focus: '完整展示 UI、通讯、数据保存、日志、排错和验收。',
  },
  {
    id: '15min',
    label: '15 分钟课程设计汇报版',
    minutes: 15,
    focus: '补充学习路线、实验迁移、代码结构和扩展方向。',
  },
];

function pickSteps(mode: DemoMode): DemoStep[] {
  const base: DemoStep[] = [
    {
      id: 'opening',
      title: '项目目标与应用场景',
      minutes: mode === '3min' ? 0.5 : 1,
      talk: '大家好，我演示的是一个基于 C++ / MFC 的通用工业通讯调试工具。它不是单一功能按钮，而是把串口、TCP、HTTP、参数保存、日志和多线程整合到一个 Dialog 工具中，目标是帮助上位机开发者快速验证设备通讯和排查现场问题。',
      show: ['首页或作品集页', '最终项目目标', '整体学习/项目路线'],
      evidence: ['项目 README', '最终工具主界面截图', '功能模块列表'],
      route: '/portfolio',
    },
    {
      id: 'architecture',
      title: '架构与模块拆分',
      minutes: mode === '15min' ? 2 : 1,
      talk: `项目按 UI 层、通讯层、数据层和工具层拆分。UI 层负责 MFC Dialog、控件 ID、Message Map 和日志显示；通讯层包括 SerialManager、TcpClient、TcpServer、HttpClient；数据层用 ConfigStore 处理 SQLite/INI；工具层用 Logger 和 WorkerThread 保证日志统一和界面不阻塞。核心文件包括：${recommendedProjectFiles.map((file) => file.path).join('、')}。`,
      show: ['图解中心架构图', '代码骨架生成器', '推荐项目文件树'],
      evidence: ['工程目录截图', '类/模块图', '关键 .h/.cpp 文件'],
      route: '/diagrams',
    },
    {
      id: 'ui',
      title: 'MFC Dialog 界面设计',
      minutes: 1,
      talk: '界面采用 Dialog + Tab 的方式组织功能。每个通讯模块有独立参数区、发送区、接收/响应区和日志区。控件 ID 保持稳定命名，再通过 DDX 和 Message Map 绑定按钮事件，避免后期控件重命名导致事件失效。',
      show: ['Dialog 设计器', '控件 ID 表', 'Message Map 预览'],
      evidence: ['资源视图截图', '控件 ID 截图', '按钮事件断点截图'],
      route: '/designer',
    },
    {
      id: 'communication',
      title: '串口 / TCP / HTTP 通讯模块',
      minutes: mode === '3min' ? 0.8 : 2,
      talk: '通讯模块是项目核心。串口重点处理 COM、波特率、8N1、ASCII/HEX 和 Modbus 帧；TCP 要区分 Client/Server，并处理连接、发送、接收、断开和粘包边界；HTTP 则展示 GET/POST、Header、Body 和响应日志。耗时通讯不能直接写在按钮事件里，而是放到工作线程，通过消息或队列回到 UI 更新日志。',
      show: ['串口/TCP/HTTP 代码模板', '实验中心对应模拟器', '本地集成向导'],
      evidence: ['串口收发日志', 'TCP 连接/断开日志', 'HTTP 请求响应截图', '线程回调日志'],
      route: '/codegen',
    },
    {
      id: 'storage',
      title: 'SQLite / INI 参数保存',
      minutes: mode === '3min' ? 0.4 : 1,
      talk: '工具软件不能每次启动都重新配置参数，所以用 INI 保存轻量默认值，比如串口号、IP、端口；用 SQLite 保存结构化设备表、历史记录和查询结果。实现时要注意路径、默认值、编码和 SQL 参数化，避免直接拼接用户输入。',
      show: ['SQLite/INI 模板', '配置保存验收点', '数据存储实验'],
      evidence: ['app.ini 示例', 'SQLite 表结构', '重启后参数恢复截图'],
      route: '/practice',
    },
    {
      id: 'stability',
      title: '日志、多线程与稳定性',
      minutes: mode === '3min' ? 0.5 : 1.5,
      talk: '为了避免界面卡死，我把连接、接收、HTTP 请求这类耗时任务放到 WorkerThread。UI 线程只负责启动任务和显示状态，日志统一通过 Logger 追加。关闭窗口前要设置停止标志，确保线程退出，避免野指针、重复 delete 或线程仍访问已销毁窗口。',
      show: ['构建清单', 'C++ 多线程实验', 'WorkerThread 模板'],
      evidence: ['窗口拖动不卡顿演示', '停止线程日志', '错误日志格式截图'],
      route: '/build-checklist',
    },
    {
      id: 'troubleshooting',
      title: '故障排查能力',
      minutes: mode === '3min' ? 0.4 : 1,
      talk: '现场调试时，问题通常不是单点错误，而是参数、协议、线程、路径和消息映射共同影响。我会按“症状、证据、根因、修复步骤”的顺序排查，例如串口乱码先查波特率和 ASCII/HEX，TCP 连接失败先查 IP/Port 和监听状态，MFC 按钮不触发先查控件 ID 和 Message Map。',
      show: ['故障排查训练场', '集成向导错误诊断', '学习报告'],
      evidence: ['故障复现记录', '修复前后日志', '诊断步骤 Markdown'],
      route: '/troubleshooting',
    },
    {
      id: 'closing',
      title: '项目总结与扩展方向',
      minutes: mode === '3min' ? 0.4 : 1,
      talk: `最后总结一下：这个项目覆盖 ${modules.length} 个学习模块和 ${practiceTemplates.length} 个本地实战模板，验收标准包括 ${capstoneRubric.map((item) => item.item).join('、')}。后续可以继续扩展协议插件、日志导出、设备配置管理、脚本化测试和更完整的安装包。`,
      show: ['答辩训练', '作品集页面', 'Capstone 验收清单'],
      evidence: ['导出的作品集 Markdown', '答辩记录', 'Capstone 自评表'],
      route: '/exam',
    },
  ];
  if (mode === '3min')
    return base.filter((step) =>
      ['opening', 'architecture', 'communication', 'stability', 'closing'].includes(step.id),
    );
  if (mode === '5min')
    return base.filter((step) =>
      ['opening', 'architecture', 'ui', 'communication', 'stability', 'closing'].includes(step.id),
    );
  if (mode === '10min') return base.filter((step) => step.id !== 'storage' || true);
  return base;
}

function formatScript(state: DemoState, steps: DemoStep[]) {
  const mode = modeOptions.find((item) => item.id === state.mode)!;
  return `# ${state.projectName} 演示讲解稿\n\n- 版本：${mode.label}\n- 听众：${state.audience}\n- 重点：${mode.focus}\n\n## 演示流程\n${steps.map((step, index) => `\n### ${index + 1}. ${step.title}（约 ${step.minutes} 分钟）\n\n**讲解词**\n${step.talk}\n\n**屏幕展示**\n${step.show.map((item) => `- ${item}`).join('\n')}\n\n**证据清单**\n${step.evidence.map((item) => `- ${item}`).join('\n')}\n\n**我的补充证据**\n${state.customEvidence[step.id] || '（未填写）'}\n\n**证据缺口 / 下次彩排改进**\n${state.rehearsalNotes?.[step.id] || '（未填写）'}`).join('\n')}\n\n## 收尾话术\n以上就是我的 MFC 通用工具项目演示。这个项目的重点不是单个 API，而是把 UI、通讯、数据保存、日志、多线程和排错流程组织成一个可维护、可演示、可扩展的工程。`;
}

export function DemoScriptPage() {
  const [state, setState] = useLocalStorage<DemoState>(storageKeys.demoScript, {
    mode: '5min',
    projectName: 'MFC 通用工业通讯调试工具',
    audience: '面试官 / 项目验收老师 / 课程设计评委',
    customEvidence: {},
    rehearsalNotes: {},
    completed: [],
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const steps = useMemo(() => pickSteps(state.mode), [state.mode]);
  const [activeId, setActiveId] = useState(steps[0]?.id ?? 'opening');
  const active = steps.find((step) => step.id === activeId) ?? steps[0];
  const totalMinutes = steps.reduce((sum, step) => sum + step.minutes, 0);
  const missingEvidenceSteps = steps.filter((step) => !state.customEvidence[step.id]?.trim());
  const evidenceReadyCount = steps.length - missingEvidenceSteps.length;
  const script = formatScript(state, steps);

  const updateEvidence = (id: string, value: string) =>
    setState({ ...state, customEvidence: { ...state.customEvidence, [id]: value } });
  const updateRehearsalNote = (id: string, value: string) =>
    setState({ ...state, rehearsalNotes: { ...(state.rehearsalNotes ?? {}), [id]: value } });
  const fillEvidenceTemplate = (id: string, evidence: string[]) => {
    const current = state.customEvidence[id]?.trim();
    const template = evidence.map((item) => `- ${item}：待补充截图/路径/日志`).join('\n');
    updateEvidence(id, current ? `${current}\n${template}` : template);
  };
  const jumpToFirstGap = () => {
    if (missingEvidenceSteps[0]) setActiveId(missingEvidenceSteps[0].id);
  };
  const toggleDone = (id: string) =>
    setState({
      ...state,
      completed: state.completed.includes(id)
        ? state.completed.filter((item) => item !== id)
        : [...state.completed, id],
    });

  return (
    <div>
      <section className="hero demo-hero">
        <div className="eyebrow">Demo Script · Presentation Flow</div>
        <h2>项目演示脚本 / 录屏讲解稿生成器</h2>
        <p>
          把代码骨架、界面设计、集成向导、构建清单、答辩训练和作品集串成一份可直接用于验收、面试、录屏或
          README 的讲解稿。
        </p>
        <div className="form-row">
          <Link className="button button-primary" to="/portfolio">
            作品集
          </Link>
          <Link className="button button-ghost" to="/exam">
            答辩训练
          </Link>
          <Link className="button button-ghost" to="/reports">
            学习报告
          </Link>
          <Button
            className="button-ghost"
            onClick={() => downloadMarkdown('mfc-demo-script.md', script)}
          >
            导出演示稿 Markdown
          </Button>
        </div>
      </section>

      <section className="demo-summary-grid">
        <Card>
          <strong>{modeOptions.find((item) => item.id === state.mode)?.minutes}</strong>
          <span>目标分钟</span>
          <p className="muted">可按场景切换节奏</p>
        </Card>
        <Card>
          <strong>{steps.length}</strong>
          <span>演示步骤</span>
          <p className="muted">目标、架构、通讯、稳定性、总结</p>
        </Card>
        <Card>
          <strong>{totalMinutes.toFixed(1)}</strong>
          <span>脚本估算</span>
          <p className="muted">每步可按现场压缩</p>
        </Card>
        <Card>
          <strong>{state.completed.length}</strong>
          <span>已彩排</span>
          <p className="muted">本地保存彩排状态</p>
        </Card>
        <Card>
          <strong>
            {evidenceReadyCount}/{steps.length}
          </strong>
          <span>证据已补</span>
          <p className="muted">缺口会进入导出稿</p>
        </Card>
      </section>

      <Card className="demo-gap-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Evidence Gap</div>
            <h3>证据缺口雷达</h3>
          </div>
          <Button
            className="button-ghost"
            onClick={jumpToFirstGap}
            disabled={!missingEvidenceSteps.length}
          >
            跳到第一个缺口
          </Button>
        </div>
        {missingEvidenceSteps.length ? (
          <div className="demo-gap-list">
            {missingEvidenceSteps.map((step) => (
              <button key={step.id} type="button" onClick={() => setActiveId(step.id)}>
                <strong>{step.title}</strong>
                <span>{step.evidence.slice(0, 2).join(' / ')}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="success-text">所有演示步骤都已填写补充证据，可以导出演示稿并开始彩排。</p>
        )}
      </Card>

      <Card className="demo-control-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Script Settings</div>
            <h3>演示场景设置</h3>
          </div>
          <span className="badge">浏览器生成 · 本地证据补充</span>
        </div>
        <div className="demo-settings-grid">
          <label>
            项目名称
            <input
              value={state.projectName}
              onChange={(event) => setState({ ...state, projectName: event.target.value })}
            />
          </label>
          <label>
            听众对象
            <input
              value={state.audience}
              onChange={(event) => setState({ ...state, audience: event.target.value })}
            />
          </label>
          <label>
            脚本版本
            <select
              value={state.mode}
              onChange={(event) => {
                setState({ ...state, mode: event.target.value as DemoMode });
                setActiveId('opening');
              }}
            >
              {modeOptions.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.label} · {option.focus}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <section className="demo-layout">
        <Card className="demo-step-list">
          <div className="eyebrow">Run of Show</div>
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={
                active.id === step.id ? 'active' : state.completed.includes(step.id) ? 'done' : ''
              }
              onClick={() => setActiveId(step.id)}
            >
              <span>
                {index + 1}. {step.title}
              </span>
              <small>
                {step.minutes} 分钟 · {state.completed.includes(step.id) ? '已彩排' : '待准备'}
              </small>
            </button>
          ))}
        </Card>

        <Card className="demo-step-detail">
          <div className="diagram-head compact-head">
            <div>
              <div className="eyebrow">Step Script</div>
              <h3>{active.title}</h3>
            </div>
            <Link className="button button-ghost" to={active.route}>
              打开关联页面
            </Link>
          </div>
          <div className="demo-talk-block">
            <strong>讲解词</strong>
            <p>{active.talk}</p>
          </div>
          <div className="demo-two-col">
            <div>
              <strong>屏幕展示</strong>
              <ul>
                {active.show.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>证据清单</strong>
              <ul>
                {active.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <label className="field-label">
            我的补充证据 / 截图文件名 / 源码路径
            <textarea
              value={state.customEvidence[active.id] ?? ''}
              onChange={(event) => updateEvidence(active.id, event.target.value)}
              rows={6}
              placeholder="例如：screenshots/serial-send.png，SerialManager.cpp 第 80 行，运行日志 2026-xx-xx..."
            />
          </label>
          <label className="field-label">
            证据缺口 / 彩排改进
            <textarea
              value={(state.rehearsalNotes ?? {})[active.id] ?? ''}
              onChange={(event) => updateRehearsalNote(active.id, event.target.value)}
              rows={4}
              placeholder="例如：缺少 TCP 断线重连日志；下次彩排需要先打开串口虚拟设备..."
            />
          </label>
          <div className="form-row">
            <Button
              className="button-ghost"
              onClick={() => fillEvidenceTemplate(active.id, active.evidence)}
            >
              生成证据待办
            </Button>
            <Button onClick={() => toggleDone(active.id)}>
              {state.completed.includes(active.id) ? '取消彩排' : '标记已彩排'}
            </Button>
          </div>
        </Card>
      </section>

      <Card className={`demo-preview-card ${previewOpen ? 'is-open' : 'is-collapsed'}`}>
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Markdown Preview</div>
            <h3>导出预览</h3>
          </div>
          <div className="form-row preview-actions">
            <Button className="button-ghost" onClick={() => setPreviewOpen((value) => !value)}>
              {previewOpen ? '收起预览' : '展开预览'}
            </Button>
            <Button
              className="button-ghost"
              onClick={() => downloadMarkdown('mfc-demo-script.md', script)}
            >
              下载 Markdown
            </Button>
          </div>
        </div>
        {previewOpen ? (
          <pre>{script}</pre>
        ) : (
          <p className="muted">
            移动端默认收起长演示稿，先专注补证据和彩排；需要检查全文时再展开。
          </p>
        )}
      </Card>

      <Card className="demo-boundary-card">
        <div className="eyebrow">Presentation Boundary</div>
        <h3>讲解稿不是运行证明</h3>
        <p>
          这个页面只生成演示流程和话术。真正用于验收或面试时，请补充 Windows + Visual Studio + MFC
          本地工程的截图、编译结果、源码、串口/TCP/HTTP 日志、SQLite/INI 文件和故障复现记录。
        </p>
      </Card>
    </div>
  );
}

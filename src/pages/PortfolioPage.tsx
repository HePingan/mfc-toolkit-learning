import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { capstoneRubric, practiceTemplates, recommendedProjectFiles } from '../data/practice';
import { achievements } from '../data/achievements';
import { useProgress } from '../hooks/useProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type PortfolioState = {
  profile: string;
  highlights: string[];
  evidence: Record<string, string>;
};

type PortfolioSection = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  evidenceHint: string;
  route: string;
};

const defaultHighlights = [
  '使用 C++ / MFC 构建 Dialog 型工业通讯调试工具，覆盖串口、TCP、HTTP、SQLite/INI 与多线程日志。',
  '能将浏览器模拟、代码骨架、Visual Studio 本地工程和最终验收清单串成完整学习/项目证据链。',
  '重视工程稳定性：UI 不阻塞、线程可退出、错误日志可复现、配置可保存恢复。',
];

const defaultProfile =
  '面向上位机 / 工控调试工具方向，熟悉 C++、MFC Dialog、串口/Modbus、TCP Socket、HTTP 请求、SQLite/INI 参数保存和多线程日志设计。';

function buildSections(progressPercent: number): PortfolioSection[] {
  const moduleNames = modules.map((item) => item.title).join('、');
  const labNames = labs
    .map((item) => item.title)
    .slice(0, 9)
    .join('、');
  return [
    {
      id: 'project-overview',
      title: '项目概述',
      subtitle: 'MFC 通用工具开发训练营 / 工业通讯调试工具',
      bullets: [
        '目标：完成一个能演示串口、TCP Client/Server、HTTP、SQLite/INI、日志和多线程的 MFC 通用调试工具。',
        `学习路线覆盖：${moduleNames}。`,
        `当前站内学习进度：${progressPercent}%，可结合学习报告和答辩记录导出证据。`,
      ],
      evidenceHint: '建议放：最终工具截图、Tab 页面截图、运行日志、README 链接。',
      route: '/capstone',
    },
    {
      id: 'technical-stack',
      title: '技术栈与模块拆分',
      subtitle: 'C++ / MFC / Win32 通讯 / 数据存储 / 浏览器辅助训练',
      bullets: [
        `核心文件：${recommendedProjectFiles.map((file) => file.path).join('、')}。`,
        'UI 层负责控件、消息映射和日志显示；通讯层负责串口/TCP/HTTP；数据层负责 SQLite/INI；工具层负责日志和线程。',
        '网页端只做学习、模板生成和证据整理；真实串口、Socket、SQLite 运行在 Windows + Visual Studio + MFC 本地项目。',
      ],
      evidenceHint: '建议放：工程目录截图、类图/模块图、关键 .h/.cpp 代码片段。',
      route: '/codegen',
    },
    {
      id: 'lab-practice',
      title: '实验与本地实战映射',
      subtitle: '从浏览器模拟到 Visual Studio 项目验收',
      bullets: [
        `浏览器实验：${labNames} 等。`,
        `本地实战模板：${practiceTemplates.map((item) => item.title).join('、')}。`,
        '每个实验都要能说明：网页里模拟了什么、本地 MFC 应该新增哪些控件/文件、如何验收。',
      ],
      evidenceHint: '建议放：实验完成截图、Visual Studio 控件 ID 表、串口/TCP/HTTP 日志。',
      route: '/practice',
    },
    {
      id: 'quality-defense',
      title: '质量、排错与答辩准备',
      subtitle: '现场问题定位、验收标准、面试问答',
      bullets: [
        `Capstone 评分项：${capstoneRubric.map((item) => `${item.item}${item.score}分`).join('、')}。`,
        '排错能力覆盖串口参数不一致、TCP 连接失败、HTTP Header/Body 错误、MFC 消息映射失效、线程生命周期、SQLite/INI 路径问题。',
        '答辩时要拿出真实证据：编译结果、运行截图、日志、导出报告、关键代码，而不是只描述概念。',
      ],
      evidenceHint: '建议放：故障复现记录、修复前后日志、答辩训练导出 Markdown。',
      route: '/exam',
    },
  ];
}

function buildResumeMarkdown(
  state: PortfolioState,
  sections: PortfolioSection[],
  unlockedAchievements: string[],
) {
  return `# MFC 通用工具开发项目作品集\n\n## 个人定位\n${state.profile}\n\n## 简历亮点\n${state.highlights.map((item) => `- ${item}`).join('\n')}\n\n## 项目经历\n${sections.map((section) => `### ${section.title}\n${section.subtitle}\n\n${section.bullets.map((item) => `- ${item}`).join('\n')}\n\n**证据记录：** ${state.evidence[section.id] || section.evidenceHint}`).join('\n\n')}\n\n## 已解锁学习徽章\n${unlockedAchievements.length ? unlockedAchievements.map((item) => `- ${item}`).join('\n') : '- 暂无，可先完成模块、实验、测验和 Capstone 清单。'}\n\n## 本地证明边界\n网页作品集只负责整理材料。真实项目能力需要 Windows + Visual Studio + MFC 本地工程截图、编译日志、运行日志和源码文件共同证明。`;
}

export function PortfolioPage() {
  const { progress, overallPercent } = useProgress();
  const sections = useMemo(() => buildSections(overallPercent), [overallPercent]);
  const unlocked = achievements.filter((achievement) => achievement.evaluate(progress));
  const [state, setState] = useLocalStorage<PortfolioState>(storageKeys.portfolio, {
    profile: defaultProfile,
    highlights: defaultHighlights,
    evidence: {},
  });
  const [activeId, setActiveId] = useState(sections[0].id);
  const active = sections.find((item) => item.id === activeId) ?? sections[0];
  const markdown = buildResumeMarkdown(
    state,
    sections,
    unlocked.map((item) => `${item.icon} ${item.title}：${item.description}`),
  );

  const updateHighlight = (index: number, value: string) => {
    const highlights = [...state.highlights];
    highlights[index] = value;
    setState({ ...state, highlights });
  };
  const updateEvidence = (id: string, value: string) =>
    setState({ ...state, evidence: { ...state.evidence, [id]: value } });

  return (
    <div>
      <section className="hero portfolio-hero">
        <div className="eyebrow">Portfolio · Resume Material</div>
        <h2>作品集 / 简历素材生成器</h2>
        <p>
          把本站的学习进度、实战模板、Capstone
          验收和答辩训练整理成可复制到简历、README、项目报告的作品集材料。
        </p>
        <div className="form-row">
          <Link className="button button-primary" to="/reports">
            查看学习报告
          </Link>
          <Link className="button button-ghost" to="/exam">
            答辩训练
          </Link>
          <Link className="button button-ghost" to="/capstone">
            最终项目
          </Link>
          <Button
            className="button-ghost"
            onClick={() => downloadMarkdown('mfc-toolkit-portfolio.md', markdown)}
          >
            导出作品集 Markdown
          </Button>
        </div>
      </section>

      <section className="portfolio-summary-grid">
        <Card>
          <strong>{overallPercent}%</strong>
          <span>站内进度</span>
          <p className="muted">用于描述学习推进状态</p>
        </Card>
        <Card>
          <strong>{unlocked.length}</strong>
          <span>已解锁徽章</span>
          <p className="muted">可作为阶段性证明</p>
        </Card>
        <Card>
          <strong>{practiceTemplates.length}</strong>
          <span>本地实战模板</span>
          <p className="muted">可沉淀为项目模块</p>
        </Card>
        <Card>
          <strong>{capstoneRubric.length}</strong>
          <span>验收维度</span>
          <p className="muted">对应答辩评分点</p>
        </Card>
      </section>

      <section className="portfolio-editor-grid">
        <Card className="portfolio-editor-card">
          <div className="eyebrow">Resume Profile</div>
          <h3>个人定位与简历亮点</h3>
          <label className="field-label">个人定位</label>
          <textarea
            value={state.profile}
            onChange={(event) => setState({ ...state, profile: event.target.value })}
            rows={4}
          />
          <div className="portfolio-highlight-list">
            {state.highlights.map((item, index) => (
              <label key={index} className="field-label">
                亮点 {index + 1}
                <textarea
                  value={item}
                  onChange={(event) => updateHighlight(index, event.target.value)}
                  rows={3}
                />
              </label>
            ))}
          </div>
        </Card>

        <Card className="portfolio-preview-card">
          <div className="eyebrow">Copy Preview</div>
          <h3>可复制简历摘要</h3>
          <div className="terminal portfolio-terminal">
            <div>
              <span>岗位方向</span> {state.profile}
            </div>
            {state.highlights.map((item, index) => (
              <div key={index}>
                <span>亮点{index + 1}</span> {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="portfolio-section-layout">
        <Card className="portfolio-nav-card">
          <div className="eyebrow">Project Evidence</div>
          {sections.map((section) => (
            <button
              key={section.id}
              className={active.id === section.id ? 'active' : ''}
              onClick={() => setActiveId(section.id)}
            >
              <span>{section.title}</span>
              <small>{section.subtitle}</small>
            </button>
          ))}
        </Card>
        <Card className="portfolio-detail-card">
          <div className="diagram-head compact-head">
            <div>
              <div className="eyebrow">Evidence Section</div>
              <h3>{active.title}</h3>
              <p className="muted">{active.subtitle}</p>
            </div>
            <Link className="button button-ghost" to={active.route}>
              打开关联页面
            </Link>
          </div>
          <ul className="portfolio-bullets">
            {active.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <label className="field-label">
            证据记录 / 截图链接 / 本地工程说明
            <textarea
              value={state.evidence[active.id] ?? ''}
              onChange={(event) => updateEvidence(active.id, event.target.value)}
              placeholder={active.evidenceHint}
              rows={7}
            />
          </label>
        </Card>
      </section>

      <Card className="portfolio-achievement-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Achievements</div>
            <h3>可写入作品集的阶段证明</h3>
          </div>
          <Link className="button button-ghost" to="/dashboard">
            查看仪表盘
          </Link>
        </div>
        <div className="portfolio-achievement-grid">
          {unlocked.length ? (
            unlocked.map((item) => (
              <div className="portfolio-achievement" key={item.id}>
                <strong>
                  {item.icon} {item.title}
                </strong>
                <p>{item.description}</p>
                <small>{item.requirement}</small>
              </div>
            ))
          ) : (
            <p className="muted">
              还没有解锁徽章。先完成任意模块、实验或测验，即可开始生成阶段证明。
            </p>
          )}
        </div>
      </Card>

      <Card className="portfolio-boundary-card">
        <div className="eyebrow">Evidence Boundary</div>
        <h3>作品集材料不能替代真实本地工程</h3>
        <p>
          这里生成的是简历/README/报告素材。真正用于求职或验收时，需要补充 Windows + Visual Studio +
          MFC 本地项目：源码、编译截图、运行截图、通讯日志、SQLite/INI 文件和故障修复记录。
        </p>
      </Card>
    </div>
  );
}

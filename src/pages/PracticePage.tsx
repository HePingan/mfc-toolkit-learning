import { useState } from 'react';
import {
  capstoneRubric,
  practiceTemplates,
  recommendedProjectFiles,
  visualStudioChecklist,
} from '../data/practice';
import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { PageHero } from '../components/ui/PageHero';
import { SectionHead } from '../components/ui/SectionHead';
import { useProgress } from '../hooks/useProgress';
import {
  LocalPracticeChecklist,
  MfcProjectSkeleton,
  PracticeTaskCard,
  ProjectFileTree,
} from '../components/practice/PracticeTaskCard';

export function PracticePage() {
  const [activeId, setActiveId] = useState(practiceTemplates[0].id);
  const active = practiceTemplates.find((item) => item.id === activeId) ?? practiceTemplates[0];
  const module = modules.find((m) => m.id === active.moduleId);
  const { progress, togglePracticeTask } = useProgress();
  const completed = progress.completedPracticeTasks ?? [];
  const percent = Math.round((completed.length / practiceTemplates.length) * 100);

  return (
    <div>
      <SectionHead
        eyebrow="Visual Studio Practice Bridge"
        title="本地 MFC 实战桥接"
        description="网页实验负责理解概念；这一页把概念转成 Windows + Visual Studio + MFC 中可落地的项目结构、任务卡和验收标准。"
        aside={
          <span className="badge">
            本地任务 {completed.length}/{practiceTemplates.length} · {percent}%
          </span>
        }
      />

      <PageHero
        className="practice-hero"
        eyebrow="Local Build Loop"
        title="先搭项目，再接模块，最后按 Rubric 验收"
        description="把浏览器里的学习进度转换为 Visual Studio 本地项目任务，按阶段记录证据并形成最终作品集。"
      >
        <div className="dashboard-grid">
          <MetricCard
            value="1"
            label="先建 Dialog 项目"
            description="确认 MFC/ATL 组件、控件 ID、按钮事件和日志窗口。"
          />
          <MetricCard
            value="4"
            label="核心模块"
            description="Serial、TCP/HTTP、SQLite/INI、Logger/Thread。"
          />
          <MetricCard
            value="100"
            label="Rubric 分"
            description="按功能、稳定性、排错和可维护性评分。"
          />
        </div>
      </PageHero>

      <LocalPracticeChecklist
        title="Visual Studio / MFC 环境准备清单"
        items={visualStudioChecklist}
      />
      <Card>
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Code Skeleton</div>
            <h3>需要可复制的 .h/.cpp 起步代码？</h3>
          </div>
          <Link className="button" to="/codegen">
            打开代码骨架生成器
          </Link>
        </div>
        <p className="muted">
          先在本页理解任务、文件和验收点，再到代码骨架生成器选择模块并复制到 Visual Studio 项目中。
        </p>
      </Card>
      <Card>
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Before Local Coding</div>
            <h3>先做故障排查训练</h3>
          </div>
          <Link className="button" to="/troubleshooting">
            进入故障排查训练场
          </Link>
        </div>
        <p className="muted">
          本地 MFC 开发前，先练习“现场症状 → 证据 → 根因 →
          修复步骤”，避免遇到乱码、卡死、无响应、配置丢失时盲目改代码。
        </p>
      </Card>
      <ProjectFileTree files={recommendedProjectFiles} />

      <div className="practice-layout">
        <aside className="practice-list">
          {practiceTemplates.map((item) => (
            <button
              key={item.id}
              className={active.id === item.id ? 'active' : ''}
              onClick={() => setActiveId(item.id)}
            >
              <strong>
                {completed.includes(item.id) ? '✓ ' : ''}
                {item.title}
              </strong>
              <span>
                {item.stage} · {modules.find((m) => m.id === item.moduleId)?.title}
              </span>
            </button>
          ))}
        </aside>

        <main>
          <Card>
            <div className="badge-list">
              <span className="badge">{module?.title}</span>
              <span className="badge">{active.stage}</span>
              <span className="badge">Visual Studio / MFC</span>
            </div>
            <h3>{active.title}</h3>
            <p>{active.goal}</p>
            <div className="progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
          </Card>

          <PracticeTaskCard
            template={active}
            completed={completed.includes(active.id)}
            onToggle={() => togglePracticeTask(active.id)}
          />

          <div className="two-col">
            <Card>
              <h3>建议文件</h3>
              <ul>
                {active.projectFiles.map((file) => (
                  <li key={file.path}>
                    <strong>{file.path}</strong>
                    <br />
                    <span className="muted">{file.purpose}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3>常见坑</h3>
              <ul>
                {active.pitfalls.map((pitfall) => (
                  <li key={pitfall}>{pitfall}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <h3>开发步骤</h3>
            <ol className="step-list">
              {active.steps.map((step, index) => (
                <li key={step}>
                  <strong>Step {index + 1}</strong>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>
          <MfcProjectSkeleton template={active} />

          <Card>
            <h3>Capstone Rubric 评分表</h3>
            <table className="rubric-table">
              <tbody>
                {capstoneRubric.map((row) => (
                  <tr key={row.item}>
                    <td>
                      <strong>{row.item}</strong>
                      <p className="muted">{row.detail}</p>
                    </td>
                    <td>{row.score} 分</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="warning-card">
            <h3>边界说明</h3>
            <p>
              这些代码是学习模板，不会在浏览器中真实访问串口、Socket 或 SQLite。请在 Windows +
              Visual Studio 的 MFC 项目中按你的控件 ID、字符集和库版本调整。
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { labs } from '../data/labs';
import { modules } from '../data/modules';
import { practiceTemplates } from '../data/practice';
import { quizzes } from '../data/quizzes';
import { useProgress } from '../hooks/useProgress';
import { buildLearningReport } from '../utils/report';
import { Card } from '../components/ui/Card';
import { ExportButtons, RecommendationPanel, ReportSection, ReportSummary } from '../components/report/ReportCards';

export function ReportsPage() {
  const { progress } = useProgress();
  const report = buildLearningReport(progress);
  const quizModuleCount = Array.from(new Set(quizzes.map((q) => q.moduleId))).length;

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Learning Report Package</div>
          <h2>学习报告与项目交付包</h2>
          <p className="muted">把学习进度、实验、测验、错题、本地 MFC 实战和 Capstone 自评汇总成可导出的 Markdown/JSON 报告。</p>
        </div>
        <span className="badge">生成时间 {new Date(report.generatedAt).toLocaleString()}</span>
      </section>

      <section className="hero report-hero">
        <div className="eyebrow">From Learning To Delivery</div>
        <h2>把学习过程沉淀成可交付结果</h2>
        <p>报告用于复盘薄弱点、整理 Visual Studio/MFC 本地项目任务，并作为最终 Capstone 项目的验收依据。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/practice">继续本地 MFC 实战</Link>
          <Link className="button button-ghost" to="/codegen">生成代码骨架</Link>
          <Link className="button button-ghost" to="/troubleshooting">补排错训练</Link>
        </div>
      </section>

      <ReportSummary report={report} />
      <RecommendationPanel report={report} />
      <ExportButtons report={report} />

      <ReportSection title="总体完成情况" eyebrow="Overview">
        <div className="report-overview-grid">
          <div><strong>{report.completedModules.length}/{modules.length}</strong><span>课程模块</span></div>
          <div><strong>{report.completedLabs.length}/{labs.length}</strong><span>交互实验</span></div>
          <div><strong>{Object.keys(report.quizScores).length}/{quizModuleCount}</strong><span>模块测验</span></div>
          <div><strong>{report.wrongQuestions.length}</strong><span>错题数量</span></div>
          <div><strong>{report.completedPracticeTasks.length}/{practiceTemplates.length}</strong><span>本地实战任务</span></div>
          <div><strong>{report.capstoneChecks.length}/19</strong><span>项目验收项</span></div>
        </div>
      </ReportSection>

      <ReportSection title="模块掌握度与建议" eyebrow="Module Mastery">
        <div className="report-table-list">
          {report.moduleRows.map((row) => (
            <div className="report-row" key={row.id}>
              <div><strong>{row.completed ? '✅' : '⭕'} {row.title}</strong><p className="muted">实验 {row.labDone}/{row.labTotal} · 测验 {row.quizScore ?? '未完成'} · {row.recommendation}</p></div>
              <div className="mastery-meter"><span>{row.mastery}%</span><div className="progress-bar"><i style={{ width: `${row.mastery}%` }} /></div></div>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection title="实验完成清单" eyebrow="Labs">
        <div className="report-lab-grid">
          {modules.map((module) => {
            const moduleLabs = labs.filter((lab) => lab.moduleId === module.id);
            if (!moduleLabs.length) return null;
            return <Card key={module.id}><h3>{module.icon} {module.title}</h3>{moduleLabs.map((lab) => <div className={`lab-status ${report.completedLabs.includes(lab.id) ? 'done' : ''}`} key={lab.id}><strong>{report.completedLabs.includes(lab.id) ? '✓' : '○'} {lab.title}</strong><span>{lab.level}</span></div>)}</Card>;
          })}
        </div>
      </ReportSection>

      <ReportSection title="测验成绩与错题复盘" eyebrow="Quiz / Wrong Questions">
        <div className="two-col">
          <Card><h3>测验成绩</h3>{Object.keys(report.quizScores).length === 0 ? <p className="muted">暂无测验成绩。</p> : Object.entries(report.quizScores).map(([id, score]) => <p key={id}><strong>{modules.find((m) => m.id === id)?.title ?? id}</strong>：{score} 分</p>)}</Card>
          <Card className={report.wrongQuestions.length ? 'warning-card' : ''}><h3>错题复盘</h3>{report.wrongQuestions.length === 0 ? <p className="success-text">暂无错题。</p> : report.wrongQuestions.slice(0, 8).map((q) => <div className="wrong-item" key={q.id}><strong>{q.moduleId}：{q.question}</strong><p>{q.explanation}</p></div>)}</Card>
        </div>
      </ReportSection>

      <ReportSection title="本地 MFC 实战任务" eyebrow="Visual Studio Practice">
        <div className="report-practice-grid">
          {practiceTemplates.map((task) => <Card className={report.completedPracticeTasks.includes(task.id) ? 'practice-task-card done' : 'practice-task-card'} key={task.id}><div className="eyebrow">{task.stage}</div><h3>{report.completedPracticeTasks.includes(task.id) ? '✅' : '⭕'} {task.title}</h3><p className="muted">{task.goal}</p></Card>)}
        </div>
      </ReportSection>

      <ReportSection title="Capstone 交付成熟度" eyebrow="Project Delivery">
        <div className="progress-bar report-capstone-bar"><span style={{ width: `${report.capstonePercent}%` }} /></div>
        <p className="muted">当前项目交付成熟度：{report.capstonePercent}%</p>
        {report.capstoneChecks.length === 0 ? <p className="muted">暂无已勾选验收项。</p> : <div className="badge-list">{report.capstoneChecks.map((item) => <span className="badge badge-success" key={item}>✓ {item}</span>)}</div>}
      </ReportSection>
    </div>
  );
}

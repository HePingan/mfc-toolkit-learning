import { Link } from 'react-router-dom';
import { LearningReport, reportToMarkdown } from '../../utils/report';
import { downloadJson, downloadMarkdown } from '../../utils/download';
import { Card } from '../ui/Card';

type ReportSummaryProps = {
  report: LearningReport;
};

export function ReportSummary({ report }: ReportSummaryProps) {
  const stats = [
    { label: '总体进度', value: `${report.overallPercent}%`, note: '模块 / 实验 / 测验综合' },
    { label: '本地实战', value: `${report.practicePercent}%`, note: 'Visual Studio / MFC 任务' },
    { label: '项目自评', value: `${report.capstonePercent}%`, note: 'Capstone 验收清单' },
    { label: '成就徽章', value: `${report.achievementUnlocked}/${report.achievementTotal}`, note: '自动解锁学习成果' },
  ];
  return <section className="dashboard-grid report-summary-grid">{stats.map((item) => <Card key={item.label}><span className="big-number">{item.value}</span><strong>{item.label}</strong><p className="muted">{item.note}</p></Card>)}</section>;
}

export function ReportSection({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return <Card className="report-section"><div className="section-head compact-head"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h3>{title}</h3></div></div>{children}</Card>;
}

export function RecommendationPanel({ report }: ReportSummaryProps) {
  return (
    <Card className="report-recommendation-card">
      <div className="eyebrow">Next Actions</div>
      <h3>下一步行动建议</h3>
      <ol className="step-list">{report.recommendations.map((item, index) => <li key={item}><strong>建议 {index + 1}</strong><span>{item}</span></li>)}</ol>
      <div className="form-row">
        <Link className="button button-ghost" to="/quiz">处理测验/错题</Link>
        <Link className="button button-ghost" to="/practice">进入本地实战</Link>
        <Link className="button button-ghost" to="/capstone">查看项目验收</Link>
      </div>
    </Card>
  );
}

export function ExportButtons({ report }: ReportSummaryProps) {
  const markdown = reportToMarkdown(report);
  return (
    <Card className="report-export-card">
      <div className="diagram-head compact-head">
        <div><div className="eyebrow">Export Package</div><h3>导出学习报告 / 项目交付包</h3></div>
        <span className="badge">Markdown / JSON</span>
      </div>
      <p className="muted">导出的 Markdown 适合复盘和打印；JSON 适合备份、迁移或后续自动分析。</p>
      <div className="form-row">
        <button className="button" onClick={() => downloadMarkdown(`mfc-toolkit-learning-report-${Date.now()}.md`, markdown)}>导出 Markdown</button>
        <button className="button button-ghost" onClick={() => downloadJson(`mfc-toolkit-learning-report-${Date.now()}.json`, report)}>导出 JSON</button>
      </div>
      <details className="report-preview"><summary>预览 Markdown 报告</summary><pre className="code-block"><code>{markdown}</code></pre></details>
    </Card>
  );
}

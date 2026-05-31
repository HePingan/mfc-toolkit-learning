import { Link } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import { modules } from '../../data/modules';
import { labs } from '../../data/labs';
import { Badge } from '../ui/Badge';
import { achievementSummary } from '../../data/achievements';

export function ProgressPanel() {
  const { progress, overallPercent } = useProgress();
  const quizCount = Object.keys(progress.quizScores).length;
  const achievements = achievementSummary(progress);
  return (
    <aside className="progress-panel">
      <div className="sidebar-title">学习进度</div>
      <div className="progress-ring">{overallPercent}%</div>
      <div className="progress-bar"><span style={{ width: `${overallPercent}%` }} /></div>
      <p className="muted">模块 {progress.completedModules.length}/{modules.length} · 实验 {progress.completedLabs.length}/{labs.length} · 测验 {quizCount}/{modules.length}</p>
      <div className="mini-achievement-box">
        <span>🏅 成就徽章</span>
        <strong>{achievements.unlockedCount}/{achievements.total}</strong>
      </div>
      <div className="badge-list">
        {modules.map((m) => <Badge key={m.id} tone={progress.completedModules.includes(m.id) ? 'success' : 'default'}>{m.title}</Badge>)}
      </div>
      {progress.wrongQuestions.length > 0 && <p className="warning-text">错题本：{progress.wrongQuestions.length} 题待复习</p>}
      <Link className="button button-ghost panel-button" to="/practice">本地 MFC 实战</Link>
      <Link className="button button-ghost panel-button" to="/codegen">代码骨架生成器</Link>
      <Link className="button button-ghost panel-button" to="/designer">界面布局设计器</Link>
      <Link className="button button-ghost panel-button" to="/integration">本地集成向导 v2</Link>
      <Link className="button button-ghost panel-button" to="/troubleshooting">故障排查训练</Link>
      <Link className="button button-ghost panel-button" to="/reports">学习报告</Link>
      <Link className="button button-ghost panel-button" to="/dashboard">打开学习仪表盘</Link>
    </aside>
  );
}

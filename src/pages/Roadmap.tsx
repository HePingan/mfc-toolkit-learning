import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { getQuizzesByModule } from '../data/quizzes';
import { Card } from '../components/ui/Card';
import { useProgress } from '../hooks/useProgress';
import { masteryScore } from '../utils/progress';
import { LearningPathDiagram } from '../components/course/Diagrams';

export function Roadmap() {
  const { progress } = useProgress();
  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Roadmap</div>
          <h2>学习路线图</h2>
          <p className="muted">首页 → 学习路线 → 模块讲解 → 交互实验 → 小测验 → 最终项目，符合文档中的课程化路径。</p>
        </div>
        <Link className="button button-ghost" to="/quiz">去测验中心</Link>
      </section>
      <LearningPathDiagram />
      <div className="roadmap-flow">
        {modules.map((m, i) => (
          <Card key={m.id} className="roadmap-card">
            <div className="roadmap-meta"><span className="step">{i + 1}</span><span className="badge">掌握度 {masteryScore(m.id, progress)}%</span></div>
            <h3>{m.icon} {m.title}</h3>
            <p>{m.subtitle}</p>
            <p className="muted">目标 {m.objectives.length} 项 · 实验 {m.labs.length} 个 · 测验 {getQuizzesByModule(m.id).length} 题 · 预计 {m.estimatedMinutes} 分钟</p>
            <div className="progress-bar"><span style={{ width: `${masteryScore(m.id, progress)}%` }} /></div>
            <div className="badge-list">{m.concepts.slice(0, 6).map((c) => <span className="badge" key={c}>{c}</span>)}</div>
            <Link className="button" to={`/modules/${m.id}`}>进入模块</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

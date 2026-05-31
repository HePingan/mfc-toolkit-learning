import { Link, useParams } from 'react-router-dom';
import { getModule, getNextModule } from '../data/modules';
import { LessonSection } from '../components/course/LessonSection';
import { Button } from '../components/ui/Button';
import { useProgress } from '../hooks/useProgress';
import { ConceptCard } from '../components/course/ConceptCard';
import { masteryScore } from '../utils/progress';
import { labs } from '../data/labs';
import { getQuizzesByModule } from '../data/quizzes';
import { ModuleConceptDiagram } from '../components/course/Diagrams';
import { Card } from '../components/ui/Card';

export function ModulePage() {
  const { moduleId } = useParams();
  const module = getModule(moduleId);
  const next = getNextModule(module.id);
  const { progress, markModule } = useProgress();
  const relatedLabs = labs.filter((lab) => module.labs.includes(lab.id));
  const quizCount = getQuizzesByModule(module.id).length;
  const completed = progress.completedModules.includes(module.id);

  return (
    <div>
      <div className="page-title module-hero-card">
        <span className="module-icon">{module.icon}</span>
        <div>
          <div className="eyebrow">Module · {module.id}</div>
          <h2>{module.title}</h2>
          <p>{module.subtitle}</p>
          <p className="muted">预计 {module.estimatedMinutes} 分钟 · 掌握度 {masteryScore(module.id, progress)}% · 实验 {relatedLabs.length} 个 · 测验 {quizCount} 题</p>
        </div>
      </div>
      <p className="lead">{module.description}</p>
      {module.chapterSummary && <Card className="chapter-summary-card"><div className="eyebrow">Chapter Summary</div><h3>本章学习重点</h3><p>{module.chapterSummary}</p></Card>}
      <ModuleConceptDiagram module={module} />
      <div className="two-col"><ConceptCard title="学习目标" items={module.objectives} /><ConceptCard title="核心概念" items={module.concepts} /></div>
      {module.sections.map((section) => <LessonSection key={section.heading} section={section} />)}
      {relatedLabs.length > 0 && <ConceptCard title="本章交互实验" items={relatedLabs.map((lab) => `${progress.completedLabs.includes(lab.id) ? '✓ ' : ''}${lab.title}：${lab.summary}`)} />}
      <ConceptCard title="常见坑" items={module.commonMistakes} tone="warning" />
      <div className="task-box"><strong>本章任务：</strong>{module.projectTask}</div>

      {module.localPractice && (
        <Card className="local-practice-card">
          <div className="diagram-head compact-head">
            <div>
              <div className="eyebrow">Local Visual Studio Practice</div>
              <h3>{module.localPractice.title}</h3>
            </div>
            {module.localPractice.relatedRoute && <Link className="button button-ghost" to={module.localPractice.relatedRoute}>打开相关工具</Link>}
          </div>
          <p className="warning-text">真实 MFC 编译、串口、Socket、SQLite 操作需要在 Windows + Visual Studio 本地完成；本网站只提供模拟、步骤和模板。</p>
          <div className="two-col">
            <div>
              <h4>实战步骤</h4>
              <ol className="step-list compact-step-list">{module.localPractice.steps.map((step, index) => <li key={step}><strong>{index + 1}</strong><span>{step}</span></li>)}</ol>
            </div>
            <div>
              <h4>验收标准</h4>
              <ul className="acceptance-list">{module.localPractice.acceptance.map((item) => <li key={item}>✅ {item}</li>)}</ul>
            </div>
          </div>
        </Card>
      )}

      {module.nextActions && <ConceptCard title="学完本章后做什么" items={module.nextActions} />}

      <div className="form-row action-row">
        <Button onClick={() => markModule(module.id)}>{completed ? '已完成，再次确认' : '标记本模块完成'}</Button>
        {relatedLabs.length > 0 && <Link className="button button-ghost" to="/labs">去做交互实验</Link>}
        <Link className="button button-ghost" to="/quiz">进入本章测验</Link>
        {module.localPractice?.relatedRoute && <Link className="button button-ghost" to={module.localPractice.relatedRoute}>本地实践</Link>}
        {next && <Link className="button button-ghost" to={`/modules/${next.id}`}>下一章：{next.title}</Link>}
      </div>
    </div>
  );
}

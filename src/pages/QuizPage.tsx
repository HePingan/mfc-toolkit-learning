import { QuizRunner } from '../components/quiz/QuizRunner';
import { getQuestion } from '../data/quizzes';
import { useProgress } from '../hooks/useProgress';
import { Card } from '../components/ui/Card';

export function QuizPage() {
  const { progress, removeWrongQuestion } = useProgress();
  const wrong = progress.wrongQuestions.map(getQuestion).filter(Boolean);
  const scoreValues = Object.values(progress.quizScores);
  const avg = scoreValues.length ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0;
  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Quiz Center</div>
          <h2>测验中心</h2>
          <p className="muted">每个模块 8 道题，包含单选、多选、判断、代码判断和场景题；提交后保存成绩与错题。</p>
        </div>
        <span className="badge">已完成 {scoreValues.length} 个模块 · 平均 {avg}%</span>
      </section>
      <QuizRunner />
      <h2>错题回顾</h2>
      {wrong.length === 0 ? <Card><p className="success-text">暂无错题。做完测验后，这里会自动出现需要复习的问题。</p></Card> : wrong.map((q) => q && <Card key={q.id} className="wrong-review-card"><h3>{q.question}</h3><p>答案：{Array.isArray(q.answer) ? q.answer.join('、') : q.answer}</p><p>{q.explanation}</p><button className="button" onClick={() => removeWrongQuestion(q.id)}>已掌握，移出错题本</button></Card>)}
    </div>
  );
}

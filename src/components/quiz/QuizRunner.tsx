import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzesByModule } from '../../data/quizzes';
import { modules } from '../../data/modules';
import { labs } from '../../data/labs';
import { gradeQuiz } from '../../utils/quiz';
import { Button } from '../ui/Button';
import { QuestionRenderer } from './QuestionRenderer';
import { ScorePanel } from './ScorePanel';
import { WrongQuestionList } from './WrongQuestionList';
import { useProgress } from '../../hooks/useProgress';
import { Card } from '../ui/Card';

function QuizNextStepPanel({
  moduleId,
  score,
  wrongCount,
}: {
  moduleId: string;
  score: number;
  wrongCount: number;
}) {
  const module = modules.find((item) => item.id === moduleId) ?? modules[0];
  const relatedLabs = labs.filter((lab) => lab.moduleId === moduleId);
  const level = score >= 90 ? '优秀' : score >= 80 ? '达标' : score >= 60 ? '需要复习' : '建议重学';
  const recommendations =
    score >= 90
      ? [
          '进入本地 MFC 实战，把本章实验迁移到 Visual Studio。',
          '如果本章有实验，尝试根据控件 ID 和 Message Map 写出真实代码。',
          '继续下一章或进入 Capstone 自评。',
        ]
      : score >= 80
        ? [
            '先复盘错题解析，确认不是靠猜选对。',
            '完成本章所有交互实验，再进入本地实践。',
            '把本章常见坑写入学习笔记。',
          ]
        : [
            '回到本章课程页重新阅读“常见坑”和“本章学习重点”。',
            '重做关联实验，尤其关注本地 MFC 实现提示。',
            '进入故障排查训练场，用现场案例巩固根因判断。',
          ];

  return (
    <Card className="quiz-next-step-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Adaptive Next Steps</div>
          <h3>测验后学习闭环：{level}</h3>
        </div>
        <span className={`badge ${score >= 80 ? 'badge-success' : 'badge-warning'}`}>
          错题 {wrongCount} 道
        </span>
      </div>
      <p className="muted">
        当前模块：{module.title}。测验提交后不要只看分数，要把错题、实验、本地实践和排错案例串起来。
      </p>
      <div className="quiz-loop-grid">
        <div>
          <strong>推荐复习动作</strong>
          {recommendations.map((item) => (
            <span key={item}>→ {item}</span>
          ))}
        </div>
        <div>
          <strong>关联实验</strong>
          {relatedLabs.length ? (
            relatedLabs.map((lab) => <span key={lab.id}>🧪 {lab.title}</span>)
          ) : (
            <span>本章主要进入综合项目验收。</span>
          )}
        </div>
      </div>
      <div className="form-row action-row">
        <Link className="button button-ghost" to={`/modules/${moduleId}`}>
          回到本章课程
        </Link>
        <Link className="button button-ghost" to="/labs">
          重做关联实验
        </Link>
        <Link className="button button-ghost" to="/practice">
          本地 MFC 实战
        </Link>
        <Link className="button button-ghost" to="/troubleshooting">
          故障排查训练
        </Link>
      </div>
    </Card>
  );
}

export function QuizRunner() {
  const [moduleId, setModuleId] = useState(modules[0].id);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const { progress, saveQuizScore } = useProgress();
  const questions = useMemo(() => getQuizzesByModule(moduleId), [moduleId]);
  const result = useMemo(() => gradeQuiz(questions, answers), [answers, questions]);
  const answered = questions.filter(
    (q) =>
      answers[q.id] !== undefined &&
      (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).length > 0 : true),
  ).length;
  const submit = () => {
    setSubmitted(true);
    saveQuizScore(
      moduleId,
      result.score,
      result.wrong.map((q) => q.id),
    );
  };
  const changeModule = (id: string) => {
    setModuleId(id);
    setAnswers({});
    setSubmitted(false);
  };
  return (
    <div className="quiz-runner">
      <div className="form-row quiz-toolbar">
        <select value={moduleId} onChange={(e) => changeModule(e.target.value)}>
          {modules.map((m) => (
            <option value={m.id} key={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        <span className="badge">历史成绩：{progress.quizScores[moduleId] ?? '未完成'}</span>
        <span className="badge">
          已作答：{answered}/{questions.length}
        </span>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${Math.round((answered / questions.length) * 100)}%` }} />
      </div>
      {questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          value={answers[q.id]}
          submitted={submitted}
          onChange={(a) => setAnswers({ ...answers, [q.id]: a })}
        />
      ))}
      <div className="form-row">
        <Button onClick={submit} disabled={answered === 0}>
          提交测验
        </Button>
        <button
          className="button button-ghost"
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
          }}
        >
          重做本章
        </button>
      </div>
      {submitted && (
        <>
          <ScorePanel score={result.score} total={result.total} correct={result.correct} />
          <QuizNextStepPanel
            moduleId={moduleId}
            score={result.score}
            wrongCount={result.wrong.length}
          />
          <WrongQuestionList questions={result.wrong} />
        </>
      )}
    </div>
  );
}

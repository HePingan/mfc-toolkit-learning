import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { modules } from '../../data/modules';
import { labs } from '../../data/labs';
import {
  buildQuizAnalytics,
  buildQuizForMode,
  getQuestionTags,
  gradeQuiz,
  QuizMode,
} from '../../utils/quiz';
import { Button } from '../ui/Button';
import { QuestionRenderer } from './QuestionRenderer';
import { ScorePanel } from './ScorePanel';
import { WrongQuestionList } from './WrongQuestionList';
import { useProgress } from '../../hooks/useProgress';
import { Card } from '../ui/Card';

const modeOptions: { id: QuizMode; label: string; description: string }[] = [
  { id: 'module', label: '本章测验', description: '按当前课程模块顺序训练' },
  { id: 'wrong', label: '错题回炉', description: '只抽历史错题，适合复盘解析' },
  { id: 'weak', label: '弱项强化', description: '按低分模块和错题标签自动组卷' },
  { id: 'sprint', label: '冲刺混练', description: '场景题 + 代码审查题混合训练' },
];

function QuizNextStepPanel({
  moduleId,
  score,
  wrongCount,
  recommendedLabIds,
  recommendedCodegenModules,
}: {
  moduleId: string;
  score: number;
  wrongCount: number;
  recommendedLabIds: string[];
  recommendedCodegenModules: string[];
}) {
  const module = modules.find((item) => item.id === moduleId) ?? modules[0];
  const fallbackLabs = labs.filter((lab) => lab.moduleId === moduleId).map((lab) => lab.id);
  const relatedLabs = (recommendedLabIds.length ? recommendedLabIds : fallbackLabs)
    .map((labId) => labs.find((lab) => lab.id === labId))
    .filter((lab): lab is (typeof labs)[number] => Boolean(lab));
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
        <div>
          <strong>推荐代码骨架</strong>
          {recommendedCodegenModules.length ? (
            recommendedCodegenModules.map((item) => <span key={item}>⚙️ {item}</span>)
          ) : (
            <span>完成更多测验后自动推荐 Serial / Network / Storage 等模块。</span>
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
        <Link className="button button-ghost" to="/codegen">
          打开代码骨架
        </Link>
      </div>
    </Card>
  );
}

export function QuizRunner() {
  const [moduleId, setModuleId] = useState(modules[0].id);
  const [mode, setMode] = useState<QuizMode>('module');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const { progress, saveQuizScore } = useProgress();
  const analytics = useMemo(() => buildQuizAnalytics(progress), [progress]);
  const questions = useMemo(
    () => buildQuizForMode(mode, moduleId, progress),
    [mode, moduleId, progress],
  );
  const result = useMemo(() => gradeQuiz(questions, answers), [answers, questions]);
  const answered = questions.filter(
    (q) =>
      answers[q.id] !== undefined &&
      (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).length > 0 : true),
  ).length;
  const submittedWrongTags = useMemo(
    () => Array.from(new Set(result.wrong.flatMap(getQuestionTags))).slice(0, 10),
    [result.wrong],
  );
  const submit = () => {
    setSubmitted(true);
    saveQuizScore(
      moduleId,
      result.score,
      result.wrong.map((q) => q.id),
    );
  };
  const resetSession = () => {
    setAnswers({});
    setSubmitted(false);
  };
  const changeModule = (id: string) => {
    setModuleId(id);
    resetSession();
  };
  const changeMode = (nextMode: QuizMode) => {
    setMode(nextMode);
    resetSession();
  };
  return (
    <div className="quiz-runner">
      <Card className="quiz-mode-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Adaptive Quiz Modes</div>
            <h3>训练模式</h3>
          </div>
          <span className="badge">平均分：{analytics.averageScore || '未开始'}</span>
        </div>
        <div className="quiz-mode-grid">
          {modeOptions.map((option) => (
            <button
              className={`quiz-mode-option ${mode === option.id ? 'active' : ''}`}
              key={option.id}
              onClick={() => changeMode(option.id)}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
        <div className="quiz-insight-row">
          <span className="badge">弱项模块：{analytics.weakestModuleId ?? '暂无'}</span>
          <span className="badge">历史错题：{progress.wrongQuestions.length}</span>
          <span className="badge">已测模块：{analytics.completedModules}</span>
        </div>
        {analytics.topWeakTags.length > 0 && (
          <div className="badge-list quiz-tag-list">
            {analytics.topWeakTags.map((tag) => (
              <span className="badge badge-warning" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="form-row quiz-toolbar">
        <select
          value={moduleId}
          onChange={(e) => changeModule(e.target.value)}
          disabled={mode !== 'module'}
        >
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
        <span className="badge">当前题量：{questions.length}</span>
      </div>
      <div className="progress-bar">
        <span
          style={{
            width: `${questions.length ? Math.round((answered / questions.length) * 100) : 0}%`,
          }}
        />
      </div>
      {questions.length ? (
        questions.map((q) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            value={answers[q.id]}
            submitted={submitted}
            onChange={(a) => setAnswers({ ...answers, [q.id]: a })}
          />
        ))
      ) : (
        <Card>
          <h3>暂无可训练题目</h3>
          <p className="muted">先完成一次本章测验，系统会记录错题并生成错题回炉/弱项强化试卷。</p>
        </Card>
      )}
      <div className="form-row">
        <Button onClick={submit} disabled={answered === 0 || questions.length === 0}>
          提交测验
        </Button>
        <button className="button button-ghost" onClick={resetSession}>
          重做本轮
        </button>
      </div>
      {submitted && (
        <>
          <ScorePanel score={result.score} total={result.total} correct={result.correct} />
          {submittedWrongTags.length > 0 && (
            <div className="badge-list quiz-tag-list">
              {submittedWrongTags.map((tag) => (
                <span className="badge badge-warning" key={tag}>
                  错题弱点 #{tag}
                </span>
              ))}
            </div>
          )}
          <QuizNextStepPanel
            moduleId={moduleId}
            score={result.score}
            wrongCount={result.wrong.length}
            recommendedLabIds={analytics.recommendedLabIds}
            recommendedCodegenModules={analytics.recommendedCodegenModules}
          />
          <WrongQuestionList questions={result.wrong} />
        </>
      )}
    </div>
  );
}

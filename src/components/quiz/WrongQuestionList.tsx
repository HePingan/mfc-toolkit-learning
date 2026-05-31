import { QuizQuestion } from '../../data/quizzes';

export function WrongQuestionList({ questions }: { questions: QuizQuestion[] }) {
  if (!questions.length) return <p className="success-text">没有错题，继续保持。</p>;
  return (
    <div>
      {questions.map((q) => (
        <div className="wrong-item" key={q.id}>
          <strong>{q.question}</strong>
          <p>正确答案：{Array.isArray(q.answer) ? q.answer.join('、') : q.answer}</p>
          <p>{q.explanation}</p>
        </div>
      ))}
    </div>
  );
}

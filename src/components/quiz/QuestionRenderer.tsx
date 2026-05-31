import { QuizQuestion } from '../../data/quizzes';
import { isCorrect } from '../../utils/quiz';

export function QuestionRenderer({
  question,
  value,
  onChange,
  submitted,
}: {
  question: QuizQuestion;
  value?: string | string[];
  onChange: (answer: string | string[]) => void;
  submitted?: boolean;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const answerList = Array.isArray(question.answer) ? question.answer : [question.answer];
  const hasAnswer = selected.length > 0;
  const correct = isCorrect(question, value);
  const toggle = (option: string) => {
    if (question.type === 'multiple')
      onChange(
        selected.includes(option)
          ? selected.filter((item) => item !== option)
          : [...selected, option],
      );
    else onChange(option);
  };
  return (
    <div
      className={`question ${submitted ? (correct ? 'question-correct' : hasAnswer ? 'question-wrong' : 'question-empty') : ''}`}
    >
      <div className="question-head">
        <h4>{question.question}</h4>
        <span className="badge">
          {question.type} · {question.difficulty}
        </span>
      </div>
      {question.codeSnippet && (
        <pre className="code-block">
          <code>{question.codeSnippet}</code>
        </pre>
      )}
      <div className="option-list">
        {question.options.map((option) => {
          const picked = selected.includes(option);
          const isAnswer = answerList.includes(option);
          return (
            <label
              key={option}
              className={
                submitted ? (isAnswer ? 'option-correct' : picked ? 'option-wrong' : '') : ''
              }
            >
              <input
                type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                checked={picked}
                onChange={() => toggle(option)}
              />{' '}
              {option}
            </label>
          );
        })}
      </div>
      {submitted && (
        <div className="answer-box">
          <strong>
            {correct ? '回答正确' : hasAnswer ? '需要复习' : '未作答'} · 答案：
            {answerList.join('、')}
          </strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

import { QuizQuestion } from '../data/quizzes';

export function normalizeAnswer(answer: string | string[]) {
  return Array.isArray(answer) ? [...answer].sort().join('|') : answer;
}

export function isCorrect(question: QuizQuestion, selected?: string | string[]) {
  if (selected === undefined) return false;
  return normalizeAnswer(question.answer) === normalizeAnswer(selected);
}

export function gradeQuiz(questions: QuizQuestion[], answers: Record<string, string | string[]>) {
  const correct = questions.filter((q) => isCorrect(q, answers[q.id]));
  const wrong = questions.filter(
    (q) => answers[q.id] !== undefined && !isCorrect(q, answers[q.id]),
  );
  return {
    total: questions.length,
    correct: correct.length,
    wrong,
    score: Math.round((correct.length / questions.length) * 100),
  };
}

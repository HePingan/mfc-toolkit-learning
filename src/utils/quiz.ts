import { QuizQuestion, quizzes, getQuestion, getQuizzesByModule } from '../data/quizzes';
import { ProgressState } from './progress';
import { labs } from '../data/labs';

export type QuizMode = 'module' | 'wrong' | 'weak' | 'sprint';

const moduleCodegenMap: Record<string, string[]> = {
  overview: ['ui-shell'],
  serial: ['serial'],
  network: ['network'],
  mfc: ['ui-shell'],
  'cpp-core': ['utility'],
  storage: ['storage'],
  capstone: ['serial', 'network', 'storage', 'ui-shell'],
};

const typeTags: Record<string, string[]> = {
  single: ['concept'],
  multiple: ['concept'],
  trueFalse: ['judgement'],
  codeReview: ['code-review'],
  scenario: ['scenario'],
};

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

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

export function getQuestionTags(question: QuizQuestion) {
  const text =
    `${question.question} ${question.explanation} ${question.codeSnippet ?? ''}`.toLowerCase();
  const tags = [question.moduleId, question.difficulty, ...(typeTags[question.type] ?? [])];

  if (/modbus|rtu|crc|寄存器|功能码/.test(text)) tags.push('modbus');
  if (/crc/.test(text)) tags.push('crc');
  if (/串口|com|波特率|rs485|ascii|hex/.test(text)) tags.push('serial');
  if (/tcp|socket|http|header|json|post|get|网络/.test(text)) tags.push('network');
  if (/mfc|dialog|message map|控件|ui|线程/.test(text)) tags.push('mfc');
  if (/sqlite|ini|配置|数据库|存储/.test(text)) tags.push('storage');
  if (/指针|内存|stl|线程|锁|异常/.test(text)) tags.push('cpp-core');

  return unique(tags);
}

export function getRelatedLabIds(question: QuizQuestion) {
  const tags = getQuestionTags(question);
  return labs
    .filter((lab) => lab.moduleId === question.moduleId || tags.some((tag) => lab.id.includes(tag)))
    .map((lab) => lab.id)
    .slice(0, 3);
}

export function getRelatedCodegenModules(question: QuizQuestion) {
  const tags = getQuestionTags(question);
  const modules = [...(moduleCodegenMap[question.moduleId] ?? [])];
  if (tags.includes('serial') || tags.includes('modbus') || tags.includes('crc'))
    modules.push('serial');
  if (tags.includes('network')) modules.push('network');
  if (tags.includes('storage')) modules.push('storage');
  if (tags.includes('mfc')) modules.push('ui-shell');
  if (tags.includes('cpp-core')) modules.push('utility');
  return unique(modules);
}

export function getWeakQuestionTags(progress: ProgressState) {
  const wrongTags = progress.wrongQuestions
    .map(getQuestion)
    .filter((question): question is QuizQuestion => Boolean(question))
    .flatMap(getQuestionTags);
  const lowScoreTags = Object.entries(progress.quizScores)
    .filter(([, score]) => score < 70)
    .flatMap(([moduleId]) => getQuizzesByModule(moduleId).flatMap(getQuestionTags));
  return unique([...wrongTags, ...lowScoreTags]);
}

export function buildQuizForMode(
  mode: QuizMode,
  moduleId: string,
  progress: ProgressState,
): QuizQuestion[] {
  if (mode === 'module') return getQuizzesByModule(moduleId);
  if (mode === 'wrong') {
    return progress.wrongQuestions
      .map(getQuestion)
      .filter((question): question is QuizQuestion => Boolean(question));
  }
  if (mode === 'weak') {
    const weakTags = getWeakQuestionTags(progress);
    const weakModules = Object.entries(progress.quizScores)
      .filter(([, score]) => score < 70)
      .map(([id]) => id);
    const questions = quizzes.filter(
      (question) =>
        weakModules.includes(question.moduleId) ||
        getQuestionTags(question).some((tag) => weakTags.includes(tag)),
    );
    return questions.length ? questions.slice(0, 12) : getQuizzesByModule(moduleId);
  }
  return quizzes
    .filter((question) => question.type === 'scenario' || question.type === 'codeReview')
    .slice(0, 14);
}

export function buildQuizAnalytics(progress: ProgressState) {
  const scoreEntries = Object.entries(progress.quizScores);
  const weakestModuleId = scoreEntries.length
    ? [...scoreEntries].sort((a, b) => a[1] - b[1])[0][0]
    : undefined;
  const weakTags = getWeakQuestionTags(progress);
  const tagCounts = new Map<string, number>();
  weakTags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
  const wrongQuestions = progress.wrongQuestions
    .map(getQuestion)
    .filter((question): question is QuizQuestion => Boolean(question));

  return {
    completedModules: scoreEntries.length,
    averageScore: scoreEntries.length
      ? Math.round(scoreEntries.reduce((sum, [, score]) => sum + score, 0) / scoreEntries.length)
      : 0,
    weakestModuleId,
    topWeakTags: Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 8),
    recommendedLabIds: unique(wrongQuestions.flatMap(getRelatedLabIds)),
    recommendedCodegenModules: unique(wrongQuestions.flatMap(getRelatedCodegenModules)),
  };
}

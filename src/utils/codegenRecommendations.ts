import { codegenModules } from '../data/codegen';
import { labs } from '../data/labs';
import { getQuestion, QuizQuestion } from '../data/quizzes';
import { ProgressState } from './progress';
import { getRelatedCodegenModules } from './quiz';

const moduleToCodegen: Record<string, string[]> = {
  overview: ['dialog', 'logger'],
  serial: ['serial'],
  network: ['tcp-client', 'tcp-server', 'http-client', 'worker-thread'],
  mfc: ['dialog', 'logger'],
  'cpp-core': ['worker-thread', 'logger'],
  storage: ['sqlite-store', 'config-store'],
  capstone: ['dialog', 'logger', 'serial', 'tcp-client', 'tcp-server', 'http-client', 'sqlite-store', 'config-store', 'worker-thread'],
};

const tagToCodegen: Record<string, string[]> = {
  serial: ['serial'],
  modbus: ['serial'],
  crc: ['serial'],
  network: ['tcp-client', 'tcp-server', 'http-client'],
  storage: ['sqlite-store', 'config-store'],
  mfc: ['dialog'],
  'cpp-core': ['worker-thread', 'logger'],
  'ui-shell': ['dialog'],
  utility: ['logger', 'worker-thread'],
};

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function normalizeCodegenIds(ids: string[]) {
  const validIds = new Set(codegenModules.map((module) => module.id));
  return unique(ids).filter((id) => validIds.has(id));
}

function fromQuizQuestion(question: QuizQuestion) {
  return getRelatedCodegenModules(question).flatMap((tag) => tagToCodegen[tag] ?? [tag]);
}

function fromCapstoneCheck(check: string) {
  const text = check.toLowerCase();
  const ids: string[] = [];
  if (/串口|ascii|hex|modbus|serial/.test(text)) ids.push('serial');
  if (/tcp|client/.test(text)) ids.push('tcp-client');
  if (/tcp|server/.test(text)) ids.push('tcp-server');
  if (/http|get|post/.test(text)) ids.push('http-client');
  if (/sqlite|历史/.test(text)) ids.push('sqlite-store');
  if (/ini|配置/.test(text)) ids.push('config-store');
  if (/线程|ui 卡死|多线程/.test(text)) ids.push('worker-thread');
  if (/dialog|界面|tab|控件|主题/.test(text)) ids.push('dialog');
  if (/日志|错误|导出/.test(text)) ids.push('logger');
  return ids;
}

export function getRecommendedCodegenModuleIds(progress: ProgressState) {
  const ids = [
    ...codegenModules.filter((module) => module.recommended).map((module) => module.id),
    ...progress.completedLabs.flatMap((labId) => {
      const lab = labs.find((item) => item.id === labId);
      return lab ? (moduleToCodegen[lab.moduleId] ?? []) : [];
    }),
    ...Object.entries(progress.quizScores)
      .filter(([, score]) => score < 70)
      .flatMap(([moduleId]) => moduleToCodegen[moduleId] ?? []),
    ...progress.wrongQuestions
      .map(getQuestion)
      .filter((question): question is QuizQuestion => Boolean(question))
      .flatMap(fromQuizQuestion),
    ...progress.capstoneChecks.flatMap(fromCapstoneCheck),
  ];

  const normalized = normalizeCodegenIds(ids);
  return normalized.length
    ? normalized
    : codegenModules.filter((module) => module.recommended).map((module) => module.id);
}

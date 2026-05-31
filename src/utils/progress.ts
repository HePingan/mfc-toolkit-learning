import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { quizzes } from '../data/quizzes';

export const progressStorageVersion = 2;

export type ProgressState = {
  version: typeof progressStorageVersion;
  completedModules: string[];
  completedLabs: string[];
  completedPracticeTasks?: string[];
  quizScores: Record<string, number>;
  wrongQuestions: string[];
  lastVisitedModule?: string;
  capstoneChecks: string[];
};

export const defaultProgress: ProgressState = {
  version: progressStorageVersion,
  completedModules: [],
  completedLabs: [],
  completedPracticeTasks: [],
  quizScores: {},
  wrongQuestions: [],
  capstoneChecks: [],
};

export function unique(list: string[]) {
  return Array.from(new Set(list));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? unique(value.filter((item): item is string => typeof item === 'string'))
    : [];
}

function normalizeQuizScores(value: unknown) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        (entry): entry is [string, number] =>
          typeof entry[1] === 'number' && Number.isFinite(entry[1]),
      )
      .map(([moduleId, score]) => [moduleId, Math.max(0, Math.min(100, Math.round(score)))]),
  );
}

export function normalizeProgress(value: unknown): ProgressState {
  if (!isRecord(value)) return defaultProgress;

  return {
    version: progressStorageVersion,
    completedModules: stringList(value.completedModules),
    completedLabs: stringList(value.completedLabs),
    completedPracticeTasks: stringList(value.completedPracticeTasks),
    quizScores: normalizeQuizScores(value.quizScores),
    wrongQuestions: stringList(value.wrongQuestions),
    lastVisitedModule:
      typeof value.lastVisitedModule === 'string' ? value.lastVisitedModule : undefined,
    capstoneChecks: stringList(value.capstoneChecks),
  };
}

export function migrateProgress(value: unknown): ProgressState {
  return normalizeProgress(value);
}

export function isProgressState(value: unknown): value is ProgressState {
  if (!isRecord(value)) return false;
  return (
    value.version === progressStorageVersion &&
    Array.isArray(value.completedModules) &&
    Array.isArray(value.completedLabs) &&
    Array.isArray(value.completedPracticeTasks) &&
    isRecord(value.quizScores) &&
    Array.isArray(value.wrongQuestions) &&
    Array.isArray(value.capstoneChecks)
  );
}

export function exportProgress(progress: ProgressState) {
  return {
    exportedAt: new Date().toISOString(),
    schema: 'mfc-toolkit-progress',
    version: progressStorageVersion,
    progress: normalizeProgress(progress),
  };
}

export function importProgressPayload(payload: unknown): ProgressState {
  if (isRecord(payload) && payload.schema === 'mfc-toolkit-progress') {
    return normalizeProgress(payload.progress);
  }
  return normalizeProgress(payload);
}

export function calculateOverall(progress: ProgressState) {
  const modulePart = progress.completedModules.length / modules.length;
  const labPart = progress.completedLabs.length / labs.length;
  const quizModules = unique(quizzes.map((q) => q.moduleId));
  const quizPart =
    quizModules.filter((id) => progress.quizScores[id] !== undefined).length / quizModules.length;
  return Math.round((modulePart * 0.45 + labPart * 0.35 + quizPart * 0.2) * 100);
}

export function masteryScore(moduleId: string, progress: ProgressState) {
  const courseDone = progress.completedModules.includes(moduleId) ? 100 : 0;
  const moduleLabs = labs.filter((lab) => lab.moduleId === moduleId);
  const labDone = moduleLabs.length
    ? (moduleLabs.filter((lab) => progress.completedLabs.includes(lab.id)).length /
        moduleLabs.length) *
      100
    : 100;
  const quizScore = progress.quizScores[moduleId] ?? 0;
  // 产品口径：掌握度 = 0.5 * 测验得分 + 0.3 * 实验完成率 + 0.2 * 课程完成率
  return Math.round(quizScore * 0.5 + labDone * 0.3 + courseDone * 0.2);
}

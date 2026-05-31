import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { quizzes } from '../data/quizzes';

export type ProgressState = {
  completedModules: string[];
  completedLabs: string[];
  completedPracticeTasks?: string[];
  quizScores: Record<string, number>;
  wrongQuestions: string[];
  lastVisitedModule?: string;
  capstoneChecks: string[];
};

export const defaultProgress: ProgressState = {
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

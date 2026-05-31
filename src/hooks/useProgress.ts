import { useLocalStorage } from './useLocalStorage';
import { legacyStorageKeys, storageKeys } from '../data/storageKeys';
import {
  calculateOverall,
  defaultProgress,
  importProgressPayload,
  isProgressState,
  migrateProgress,
  ProgressState,
  unique,
} from '../utils/progress';

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressState>(
    storageKeys.progress,
    defaultProgress,
    {
      validate: isProgressState,
      migrate: migrateProgress,
      legacyKeys: [...legacyStorageKeys.progress],
    },
  );
  const markModule = (id: string) =>
    setProgress((current) => ({
      ...current,
      completedModules: unique([...current.completedModules, id]),
      lastVisitedModule: id,
    }));
  const markLab = (id: string) =>
    setProgress((current) => ({
      ...current,
      completedLabs: unique([...current.completedLabs, id]),
    }));
  const saveQuizScore = (moduleId: string, score: number, wrongIds: string[]) =>
    setProgress((current) => ({
      ...current,
      quizScores: { ...current.quizScores, [moduleId]: score },
      wrongQuestions: unique([...current.wrongQuestions, ...wrongIds]),
    }));
  const removeWrongQuestion = (id: string) =>
    setProgress((current) => ({
      ...current,
      wrongQuestions: current.wrongQuestions.filter((qid) => qid !== id),
    }));
  const toggleCapstoneCheck = (id: string) =>
    setProgress((current) => ({
      ...current,
      capstoneChecks: current.capstoneChecks.includes(id)
        ? current.capstoneChecks.filter((item) => item !== id)
        : unique([...current.capstoneChecks, id]),
    }));
  const resetProgress = () => setProgress(defaultProgress);
  const importProgress = (next: unknown) => setProgress(importProgressPayload(next));
  const togglePracticeTask = (id: string) => {
    setProgress((current) => {
      const completedPracticeTasks = current.completedPracticeTasks ?? [];
      return {
        ...current,
        completedPracticeTasks: completedPracticeTasks.includes(id)
          ? completedPracticeTasks.filter((item) => item !== id)
          : unique([...completedPracticeTasks, id]),
      };
    });
  };
  return {
    progress,
    setProgress,
    markModule,
    markLab,
    saveQuizScore,
    removeWrongQuestion,
    toggleCapstoneCheck,
    togglePracticeTask,
    resetProgress,
    importProgress,
    overallPercent: calculateOverall(progress),
  };
}

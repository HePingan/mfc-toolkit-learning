import { describe, expect, it } from 'vitest';
import {
  defaultProgress,
  migrateProgress,
  normalizeProgress,
  progressStorageVersion,
} from './progress';

describe('progress storage governance', () => {
  it('normalizes damaged progress into a complete versioned shape', () => {
    const normalized = normalizeProgress({
      completedModules: ['serial', 'serial', 42],
      completedLabs: 'bad',
      completedPracticeTasks: ['dialog-shell', 'dialog-shell'],
      quizScores: { serial: 120, cpp: -10, bad: 'x' },
      wrongQuestions: [null, 'q1', 'q1'],
      capstoneChecks: undefined,
      lastVisitedModule: 123,
      version: 1,
    });

    expect(normalized).toEqual({
      ...defaultProgress,
      version: progressStorageVersion,
      completedModules: ['serial'],
      completedPracticeTasks: ['dialog-shell'],
      quizScores: { serial: 100, cpp: 0 },
      wrongQuestions: ['q1'],
    });
  });

  it('migrates legacy v1 progress and fills new collections', () => {
    const migrated = migrateProgress({
      completedModules: ['overview'],
      completedLabs: ['mfc-message-map'],
      quizScores: { overview: 80 },
      wrongQuestions: [],
      capstoneChecks: ['ui'],
    });

    expect(migrated.version).toBe(progressStorageVersion);
    expect(migrated.completedModules).toEqual(['overview']);
    expect(migrated.completedPracticeTasks).toEqual([]);
    expect(migrated.capstoneChecks).toEqual(['ui']);
  });

  it('falls back to default progress for non-object payloads', () => {
    expect(normalizeProgress(null)).toEqual(defaultProgress);
    expect(normalizeProgress('bad')).toEqual(defaultProgress);
  });
});

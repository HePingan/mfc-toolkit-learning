import { describe, expect, test } from 'vitest';
import { buildQuizAnalytics, buildQuizForMode, getQuestionTags, getWeakQuestionTags } from './quiz';
import { quizzes } from '../data/quizzes';
import { ProgressState, defaultProgress } from './progress';

const progressWithWeakSerial: ProgressState = {
  ...defaultProgress,
  quizScores: { overview: 95, serial: 45, network: 82 },
  wrongQuestions: ['serial-01', 'serial-03', 'network-02'],
};

describe('quiz enhancement helpers', () => {
  test('derives tags and related learning targets for every question', () => {
    const serial = quizzes.find((question) => question.id === 'serial-03');
    expect(serial).toBeDefined();
    expect(getQuestionTags(serial!)).toEqual(expect.arrayContaining(['serial', 'modbus', 'crc']));
  });

  test('builds weak point tags from wrong questions and low quiz scores', () => {
    expect(getWeakQuestionTags(progressWithWeakSerial)).toEqual(
      expect.arrayContaining(['serial', 'modbus', 'crc']),
    );
  });

  test('builds wrong and weak quiz modes from progress', () => {
    const wrongQuiz = buildQuizForMode('wrong', 'overview', progressWithWeakSerial);
    expect(wrongQuiz.map((question) => question.id)).toEqual([
      'serial-01',
      'serial-03',
      'network-02',
    ]);

    const weakQuiz = buildQuizForMode('weak', 'overview', progressWithWeakSerial);
    expect(weakQuiz.length).toBeGreaterThan(0);
    expect(weakQuiz.some((question) => question.moduleId === 'serial')).toBe(true);
  });

  test('summarizes weakest module, tags, related labs, and codegen modules', () => {
    const analytics = buildQuizAnalytics(progressWithWeakSerial);
    expect(analytics.weakestModuleId).toBe('serial');
    expect(analytics.topWeakTags).toEqual(expect.arrayContaining(['serial']));
    expect(analytics.recommendedLabIds.length).toBeGreaterThan(0);
    expect(analytics.recommendedCodegenModules).toEqual(expect.arrayContaining(['serial']));
  });
});

import { describe, expect, test } from 'vitest';
import { getRecommendedCodegenModuleIds } from './codegenRecommendations';
import { defaultProgress, ProgressState } from './progress';

const progress: ProgressState = {
  ...defaultProgress,
  completedLabs: ['serial-config', 'modbus-frame'],
  quizScores: { serial: 42, network: 88, capstone: 55 },
  wrongQuestions: ['serial-03', 'network-02'],
  capstoneChecks: ['capstone-serial', 'capstone-storage'],
};

describe('codegen recommendations', () => {
  test('recommends modules from labs, wrong questions, low scores, and capstone checks', () => {
    expect(getRecommendedCodegenModuleIds(progress)).toEqual(
      expect.arrayContaining(['serial', 'tcp-client', 'tcp-server', 'http-client', 'sqlite-store', 'config-store', 'dialog']),
    );
  });

  test('falls back to default recommended modules without progress signals', () => {
    expect(getRecommendedCodegenModuleIds(defaultProgress).length).toBeGreaterThan(0);
  });
});

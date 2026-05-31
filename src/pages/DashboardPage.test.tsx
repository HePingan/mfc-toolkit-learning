import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardPage } from './DashboardPage';
import { storageKeys } from '../data/storageKeys';

vi.mock('../components/progress/AchievementsPanel', () => ({
  AchievementsPanel: () => <div>AchievementsPanel</div>,
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe('DashboardPage progress import/export boundaries', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('imports legacy progress JSON and writes normalized versioned progress', async () => {
    renderDashboard();

    fireEvent.change(screen.getByLabelText('进度 JSON 文本'), {
      target: {
        value: JSON.stringify({
          completedModules: ['overview', 'overview'],
          completedLabs: 'bad',
          quizScores: { overview: 88.6 },
          wrongQuestions: [1, 'q-overview-1'],
        }),
      },
    });
    await userEvent.click(screen.getByRole('button', { name: '导入进度' }));

    expect(screen.getByRole('status')).toHaveTextContent('进度导入成功');
    const stored = JSON.parse(window.localStorage.getItem(storageKeys.progress) ?? '{}');
    expect(stored.version).toBe(2);
    expect(stored.completedModules).toEqual(['overview']);
    expect(stored.completedLabs).toEqual([]);
    expect(stored.quizScores).toEqual({ overview: 89 });
    expect(stored.wrongQuestions).toEqual(['q-overview-1']);
  });

  it('keeps current progress when import JSON is malformed', async () => {
    renderDashboard();

    fireEvent.change(screen.getByLabelText('进度 JSON 文本'), {
      target: { value: '{bad-json' },
    });
    await userEvent.click(screen.getByRole('button', { name: '导入进度' }));

    expect(screen.getByRole('status')).toHaveTextContent('导入失败');
    const stored = JSON.parse(window.localStorage.getItem(storageKeys.progress) ?? '{}');
    expect(stored.version).toBe(2);
    expect(stored.completedModules).toEqual([]);
  });
});

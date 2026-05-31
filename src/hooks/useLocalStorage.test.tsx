import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

function Harness({
  storageKey = 'test-key',
  onError,
}: {
  storageKey?: string;
  onError?: (error: unknown, phase: 'read' | 'write') => void;
}) {
  const [value, setValue] = useLocalStorage(storageKey, { count: 1 }, { onError });
  return (
    <div>
      <output aria-label="count">{value.count}</output>
      <button onClick={() => setValue({ count: 2 })}>set object</button>
      <button onClick={() => setValue((previous) => ({ count: previous.count + 1 }))}>
        increment
      </button>
    </div>
  );
}

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses initial value when key is absent', () => {
    render(<Harness />);
    expect(screen.getByLabelText('count')).toHaveTextContent('1');
  });

  it('persists updated values', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'set object' }));
    await waitFor(() => expect(window.localStorage.getItem('test-key')).toContain('2'));
  });

  it('supports function updater', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'increment' }));
    expect(screen.getByLabelText('count')).toHaveTextContent('2');
  });

  it('falls back safely on invalid JSON', () => {
    window.localStorage.setItem('bad-json', '{not-json');
    const onError = vi.fn();
    render(<Harness storageKey="bad-json" onError={onError} />);
    expect(screen.getByLabelText('count')).toHaveTextContent('1');
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'read');
  });

  it('does not throw when localStorage.setItem fails', async () => {
    const onError = vi.fn();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    render(<Harness onError={onError} />);
    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.any(Error), 'write'));
  });
});

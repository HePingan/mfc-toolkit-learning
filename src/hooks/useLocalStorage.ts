import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

type UseLocalStorageOptions<T> = {
  validate?: (value: unknown) => value is T;
  migrate?: (value: unknown) => T;
  onError?: (error: unknown, phase: 'read' | 'write') => void;
};

function resolveNextValue<T>(next: SetStateAction<T>, previous: T): T {
  return typeof next === 'function' ? (next as (value: T) => T)(previous) : next;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return initialValue;
      const parsed = JSON.parse(stored) as unknown;
      if (options.validate?.(parsed)) return parsed;
      if (options.migrate) return options.migrate(parsed);
      return parsed as T;
    } catch (error) {
      options.onError?.(error, 'read');
      return initialValue;
    }
  });

  const setStoredValue: Dispatch<SetStateAction<T>> = (next) => {
    setValue((previous) => resolveNextValue(next, previous));
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      options.onError?.(error, 'write');
      console.warn('[useLocalStorage] write failed', key, error);
    }
  }, [key, options, value]);

  return [value, setStoredValue] as const;
}

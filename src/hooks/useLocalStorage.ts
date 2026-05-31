import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

type UseLocalStorageOptions<T> = {
  validate?: (value: unknown) => value is T;
  migrate?: (value: unknown) => T;
  legacyKeys?: readonly string[];
  onError?: (error: unknown, phase: 'read' | 'write') => void;
};

function resolveNextValue<T>(next: SetStateAction<T>, previous: T): T {
  return typeof next === 'function' ? (next as (value: T) => T)(previous) : next;
}

function readStoredValue(key: string, legacyKeys: readonly string[] = []) {
  const stored = window.localStorage.getItem(key);
  if (stored) return { stored, sourceKey: key };

  for (const legacyKey of legacyKeys) {
    const legacy = window.localStorage.getItem(legacyKey);
    if (legacy) return { stored: legacy, sourceKey: legacyKey };
  }

  return { stored: null, sourceKey: key };
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const { stored, sourceKey } = readStoredValue(key, options.legacyKeys);
      if (!stored) return initialValue;
      const parsed = JSON.parse(stored) as unknown;
      if (options.validate?.(parsed)) return parsed;
      if (options.migrate) {
        const migrated = options.migrate(parsed);
        if (sourceKey !== key) {
          window.localStorage.removeItem(sourceKey);
        }
        return migrated;
      }
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

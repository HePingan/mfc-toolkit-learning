import { describe, expect, it } from 'vitest';
import { allStorageKeys, storageKeys } from './storageKeys';

describe('storage key registry', () => {
  it('keeps every localStorage key versioned and namespaced', () => {
    expect(allStorageKeys).toContain(storageKeys.progress);
    expect(new Set(allStorageKeys).size).toBe(allStorageKeys.length);

    for (const key of allStorageKeys) {
      expect(key).toMatch(/^mfc-(toolkit|local)-[a-z0-9-]+-v\d+$/);
    }
  });
});

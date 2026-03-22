import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, cache } from './services';

describe('services', () => {
  describe('storage', () => {
    beforeEach(() => {
      // Mock localStorage
      const mockStorage: Record<string, string> = {};
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; },
        clear: () => { for (const key in mockStorage) delete mockStorage[key]; },
        key: (i: number) => Object.keys(mockStorage)[i] || null,
        get length() { return Object.keys(mockStorage).length; }
      });
    });

    it('should set and get values with prefix', () => {
      storage.set('test-key', { a: 1 });
      expect(storage.get('test-key')).toEqual({ a: 1 });
      // Verify prefix in raw localStorage
      expect(localStorage.getItem('aegis_vault_test-key')).toBe('{"a":1}');
    });

    it('should return default value if not found', () => {
      expect(storage.get('non-existent', 'default')).toBe('default');
    });

    it('should remove items', () => {
      storage.set('to-remove', 123);
      storage.remove('to-remove');
      expect(storage.get('to-remove')).toBeNull();
    });
  });

  describe('cache', () => {
    it('should store and retrieve values', () => {
      cache.set('c-key', 'data');
      expect(cache.get('c-key')).toBe('data');
    });

    it('should expire values', async () => {
      vi.useFakeTimers();
      cache.set('exp-key', 'data', 100);
      expect(cache.get('exp-key')).toBe('data');
      
      vi.advanceTimersByTime(101);
      expect(cache.get('exp-key')).toBeNull();
      vi.useRealTimers();
    });
  });
});

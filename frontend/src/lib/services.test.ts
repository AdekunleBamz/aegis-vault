import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, cache, events, logger, retry, debounce, throttle } from './services';

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

  describe('events', () => {
    it('should emit and listen to events', () => {
      const callback = vi.fn();
      events.on('test-event', callback);
      events.emit('test-event', { data: 1 });
      expect(callback).toHaveBeenCalledWith({ data: 1 });
    });

    it('should unsubscribe correctly', () => {
      const callback = vi.fn();
      const unsub = events.on('unsub-event', callback);
      unsub();
      events.emit('unsub-event');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('logger', () => {
    it('should log messages if enabled', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
      logger.configure({ enabled: true, level: 'info' });
      logger.info('test message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('retry', () => {
    it('should retry failed function', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 2) throw new Error('fail');
        return 'success';
      };
      
      const result = await retry(fn, { delayMs: 10 });
      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      
      debounced();
      debounced();
      vi.advanceTimersByTime(101);
      
      expect(fn).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
      
      vi.advanceTimersByTime(101);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });
  });
});

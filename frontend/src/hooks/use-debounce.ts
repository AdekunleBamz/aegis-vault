import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * A custom hook to debounce a value.
 * Useful for preventing expensive operations (like API calls) on every keystroke.
 * 
 * @template T - The type of the value being debounced
 * @param value - The value to debounce
 * @param delayMs - The delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Clamp invalid delays to the documented default so callers cannot create NaN timers.
    const safeDelay = typeof delayMs === 'number' && delayMs >= 0 ? delayMs : 300;
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, safeDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Hook that returns a stable cancel function alongside the debounced value.
 * Calling cancel() immediately stops any pending update.
 *
 * @param value - The value to debounce
 * @param delayMs - Debounce delay in milliseconds (default 300)
 * @returns Tuple of [debouncedValue, cancel]
 */
export function useCancelableDebounce<T>(value: T, delayMs: number = 300): [T, () => void] {
  const safeDelay = typeof delayMs === 'number' && delayMs >= 0 ? delayMs : 300;
  const [debouncedValue, setDebouncedValue] = useState<T>(() => value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, safeDelay);

    return cancel;
  }, [value, safeDelay, cancel]);

  return [debouncedValue, cancel];
}

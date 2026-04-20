import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook for debouncing values with customizable delay.
 * Useful for search inputs and any field that triggers expensive operations.
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const safeDelay = typeof delayMs === 'number' && delayMs >= 0 ? delayMs : 300;
  const [debouncedValue, setDebouncedValue] = useState<T>(() => value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, safeDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, safeDelay]);

  return debouncedValue;
}

import { useState, useEffect } from 'react';

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
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

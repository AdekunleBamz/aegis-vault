import { useState, useEffect } from 'react';

/**
 * A custom hook to track the previous value of a variable.
 * Useful for detecting direction of change (e.g., increasing vs. decreasing balances).
 *
 * @template T - The type of the value being tracked
 * @param value - The current value
 * @returns The value from the previous render, or undefined on initial render
 */
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrevious(current);
    setCurrent(value);
  }, [value, current]);

  return previous;
}

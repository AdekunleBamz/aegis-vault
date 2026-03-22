import { useState, useRef, useEffect } from 'react';

/**
 * A custom hook to throttle a value.
 * Useful for limiting the rate at which a value updates (e.g., during scroll or resize).
 * 
 * @template T - The type of the value being throttled
 * @param value - The value to throttle
 * @param intervalMs - The throttle interval in milliseconds (default: 300)
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, intervalMs: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdatedRef = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdatedRef.current;

    if (timeSinceLastUpdate >= intervalMs) {
      setThrottledValue(value);
      lastUpdatedRef.current = now;
    } else {
      const handler = setTimeout(() => {
        setThrottledValue(value);
        lastUpdatedRef.current = Date.now();
      }, intervalMs - timeSinceLastUpdate);

      return () => clearTimeout(handler);
    }
  }, [value, intervalMs]);

  return throttledValue;
}

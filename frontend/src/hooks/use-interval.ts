import { useEffect, useCallback } from 'react';

/**
 * A custom hook to set up a declarative interval.
 * 
 * @param callback - The function to call on each interval tick
 * @param delay - The delay in milliseconds, or null to pause the interval
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback(), delay);
    return () => clearInterval(id);
  }, [delay, savedCallback]);
}

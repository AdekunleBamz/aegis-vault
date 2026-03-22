import { useState, useCallback } from 'react';

/**
 * A custom hook to manage a boolean toggle state.
 * Returns the state and several helper functions to manipulate it.
 * 
 * @param initialValue - The initial boolean state (default: false)
 * @returns An object with the current value, toggle, setTrue, and setFalse functions
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}

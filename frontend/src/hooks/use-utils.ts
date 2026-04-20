'use client';

/**
 * @file Utility hooks for Aegis Vault
 *
 * Provides reusable utility hooks for common patterns: local storage,
 * debouncing, media queries, toggle state, intervals, click outside detection,
 * window size tracking, and clipboard operations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Return type for the useLocalStorage hook.
 */
export interface UseLocalStorageReturn<T> {
  /** The current stored value */
  value: T;
  /** Function to update the stored value */
  setValue: (value: T | ((val: T) => T)) => void;
  /** Function to remove the stored value */
  removeValue: () => void;
  /** Whether the value has been loaded from localStorage */
  isLoaded: boolean;
}

/**
 * Hook for managing state in localStorage with SSR support.
 *
 * @param key - The localStorage key
 * @param initialValue - The value to use if no stored value exists
 * @returns Object containing value, setValue, removeValue, and isLoaded
 */
export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  const normalizedKey = typeof key === 'string' ? key.trim() : '';
  const hasValidKey = normalizedKey.length > 0;
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (!hasValidKey) {
        setIsLoaded(true);
        return;
      }
      const item = window.localStorage.getItem(normalizedKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoaded(true);
  }, [key, normalizedKey, hasValidKey]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined' && hasValidKey) {
          window.localStorage.setItem(normalizedKey, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, normalizedKey, hasValidKey]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined' && hasValidKey) {
        window.localStorage.removeItem(normalizedKey);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, normalizedKey, initialValue, hasValidKey]);

  return { value: storedValue, setValue, removeValue, isLoaded };
}

/**
 * Hook for debouncing a value change.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before the value updates
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for tracking a CSS media query match state.
 *
 * @param query - The media query string to track
 * @returns Whether the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook for detecting mobile viewport (max-width: 639px).
 *
 * @returns Whether the current viewport is mobile-sized
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/**
 * Hook for detecting tablet viewport (640px - 1023px).
 *
 * @returns Whether the current viewport is tablet-sized
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/**
 * Hook for detecting desktop viewport (min-width: 1024px).
 *
 * @returns Whether the current viewport is desktop-sized
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Hook for tracking the previous value of a variable.
 *
 * @param value - The value to track
 * @returns The previous value, or undefined on first render
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

/**
 * Return type for the useToggle hook.
 */
export interface UseToggleReturn {
  /** The current boolean value */
  value: boolean;
  /** Function to toggle the value */
  toggle: () => void;
  /** Function to set the value to true */
  setTrue: () => void;
  /** Function to set the value to false */
  setFalse: () => void;
  /** Function to set the value directly */
  setValue: (value: boolean) => void;
}

/**
 * Hook for managing a boolean toggle state.
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns Object containing value and manipulation functions
 */
export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}

/**
 * Hook for executing a callback at regular intervals.
 *
 * @param callback - The function to execute on each interval
 * @param delay - The interval duration in milliseconds, or null to pause
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook for detecting clicks outside a referenced element.
 *
 * @param ref - React ref to the element to monitor
 * @param handler - Callback to execute when a click outside is detected
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * Current window dimensions.
 */
export interface WindowSize {
  /** The width of the browser window in pixels */
  width: number;
  /** The height of the browser window in pixels */
  height: number;
}

/**
 * Hook for tracking the current window dimensions.
 *
 * @returns Object containing current width and height
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Return type for the useCopyToClipboard hook.
 */
export interface UseCopyToClipboardReturn {
  /** The last successfully copied text */
  copiedText: string | null;
  /** Whether text was recently copied */
  isCopied: boolean;
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
}

/**
 * Hook for copying text to the system clipboard.
 *
 * @returns Object containing copy status and copy function
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { copiedText, isCopied, copy };
}

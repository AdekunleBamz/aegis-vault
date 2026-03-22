import { useState, useEffect } from 'react';

/**
 * A custom hook to track the state of a media query.
 * 
 * @param query - The CSS media query to match (e.g., '(max-width: 639px)')
 * @returns Whether the media query matches the current window state
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
 * Returns true if the viewport width is 639px or less.
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 639px)');
}

/**
 * Returns true if the viewport width is between 640px and 1023px.
 */
export function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/**
 * Returns true if the viewport width is 1024px or more.
 */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

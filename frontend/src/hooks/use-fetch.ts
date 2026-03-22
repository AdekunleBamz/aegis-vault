'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Represents the state of a data fetching operation.
 * @template T - The type of the data being fetched
 */
export interface FetchState<T> {
  /** The fetched data, or null if not yet loaded or if an error occurred */
  data: T | null;
  /** Whether the initial data is currently being loaded */
  isLoading: boolean;
  /** Error object if the fetch failed, otherwise null */
  error: Error | null;
  /** Whether a revalidation fetch is currently in progress */
  isValidating: boolean;
}

/**
 * Configuration options for the useFetch hook.
 */
export interface UseFetchOptions {
  /** Interval in milliseconds for automatic background refreshing */
  refreshInterval?: number;
  /** Whether to revalidate data when the window regains focus (default: true) */
  revalidateOnFocus?: boolean;
  /** Minimum time in milliseconds between identical requests to prevent spam (default: 2000) */
  dedupingInterval?: number;
}

/**
 * A custom hook for data fetching with support for caching, revalidation, and intervals.
 * Similar to SWR or React Query but lightweight.
 * 
 * @template T - The type of the data being fetched
 * @param url - The URL to fetch data from, or null to skip fetching
 * @param options - Optional configuration for revalidation and intervals
 * @returns An object containing the fetch state and a mutate function to manually refresh
 */
export function useFetch<T>(
  url: string | null,
  options?: UseFetchOptions
): FetchState<T> & { mutate: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isValidating: false,
  });

  const {
    refreshInterval,
    revalidateOnFocus = true,
    dedupingInterval = 2000,
  } = options || {};

  const lastFetchTime = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    const now = Date.now();
    if (now - lastFetchTime.current < dedupingInterval) {
      return;
    }
    lastFetchTime.current = now;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isValidating: true }));

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState({
        data,
        isLoading: false,
        error: null,
        isValidating: false,
      });
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
        isValidating: false,
      }));
    } finally {
      abortControllerRef.current = null;
    }
  }, [url, dedupingInterval]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval || !url) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, url, fetchData]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus || !url) return;

    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [revalidateOnFocus, url, fetchData]);

  const mutate = useCallback(async () => {
    lastFetchTime.current = 0;
    await fetchData();
  }, [fetchData]);

  return { ...state, mutate };
}

// Optimistic update hook
export function useOptimistic<T>(
  initialValue: T,
  updateFn: (current: T, optimistic: T) => T
) {
  const [value, setValue] = useState(initialValue);
  const [optimisticValue, setOptimisticValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);

  const addOptimistic = useCallback(
    (newValue: T) => {
      setOptimisticValue(updateFn(value, newValue));
      setIsPending(true);
    },
    [value, updateFn]
  );

  const confirmOptimistic = useCallback(() => {
    setValue(optimisticValue);
    setIsPending(false);
  }, [optimisticValue]);

  const revertOptimistic = useCallback(() => {
    setOptimisticValue(value);
    setIsPending(false);
  }, [value]);

  return {
    value: isPending ? optimisticValue : value,
    actualValue: value,
    isPending,
    addOptimistic,
    confirmOptimistic,
    revertOptimistic,
  };
}

// Infinite scroll hook
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<T[]>,
  options?: {
    threshold?: number;
    initialPage?: number;
  }
) {
  const { threshold = 100, initialPage = 1 } = options || {};
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems = await fetchFn(page);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, fetchFn]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, threshold]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return { items, isLoading, hasMore, error, loadMore, reset };
}

// Mutation hook for POST/PUT/DELETE
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<{
    data: TData | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const data = await mutationFn(variables);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, isLoading: false, error: error as Error });
        throw error;
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}

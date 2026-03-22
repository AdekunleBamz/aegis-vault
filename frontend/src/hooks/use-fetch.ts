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

/**
 * A custom hook to handle optimistic UI updates.
 * Allows for immediate UI updates while a background operation is in progress,
 * with the ability to confirm or revert the update once the operation finishes.
 * 
 * @template T - The type of the value being updated
 * @param initialValue - The initial value
 * @param updateFn - A function to calculate the new state from the old state and a new value
 * @returns An object containing the current value, addOptimistic, confirm, and revert functions
 */
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
    /** The current state, either the confirmed value or the optimistic one if pending */
    value: isPending ? optimisticValue : value,
    /** The last confirmed value from the server/source */
    actualValue: value,
    /** Whether an optimistic update is currently awaiting confirmation/reversion */
    isPending,
    /** Trigger an optimistic update */
    addOptimistic,
    /** Confirm that the optimistic update was successful */
    confirmOptimistic,
    /** Roll back the optimistic update to the last confirmed value */
    revertOptimistic,
  };
}

/**
 * A custom hook to implement infinite scrolling for list data.
 * Automatically fetches more data as the user scrolls towards the bottom of the page.
 * 
 * @template T - The type of the items in the list
 * @param fetchFn - An async function that fetches a page of data
 * @param options - Optional configuration for threshold and initial page
 * @returns An object containing the items, loading state, hasMore flag, and helper functions
 */
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

/**
 * A custom hook to handle data mutations (POST, PUT, DELETE).
 * Manages the loading and error states for a mutation operation.
 * 
 * @template TData - The type of the data returned by the mutation
 * @template TVariables - The type of the variables passed to the mutation
 * @param mutationFn - An async function that performs the mutation
 * @returns An object containing the mutate function, the current state, and reset
 */
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

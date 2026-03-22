'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getStakerInfo, StakerInfo } from '@/lib/staking';

/**
 * Return type for the usePositions hook.
 */
export interface UsePositionsReturn {
  /** The current staking position and tier info for the staker */
  position: StakerInfo | null;
  /** Whether the position info is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, otherwise null */
  error: string | null;
  /** Function to manually trigger a position info refresh */
  refetch: () => Promise<void>;
}

/**
 * A custom hook to fetch and monitor a staker's current positions and rewards info.
 * Automatically fetches data whenever the provided address changes.
 * 
 * @param address - The Stacks address whose staking positions to retrieve
 * @returns An object containing position data, loading state, and refetch function
 */
export function usePositions(address: string): UsePositionsReturn {
  const [position, setPosition] = useState<StakerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const stakerInfo = await getStakerInfo(address);
      setPosition(stakerInfo);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch positions';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return useMemo(() => ({
    position,
    isLoading,
    error,
    refetch: fetchPositions
  }), [position, isLoading, error, fetchPositions]);
}

'use client';

/**
 * @file Positions hook for Aegis Vault
 *
 * Provides a reusable hook for fetching and managing staking position data
 * for a given wallet address.
 */

import { useState, useEffect, useCallback } from 'react';
import { getStakerInfo, StakerInfo } from '@/lib/staking';

/**
 * Return type for the usePositions hook.
 */
export interface UsePositionsReturn {
  /** The staker's position data, or null if not loaded */
  position: StakerInfo | null;
  /** Whether the position data is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, or null */
  error: string | null;
  /** Function to manually refetch the position data */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a user's staking position.
 *
 * @param address - The Stacks address to fetch position for
 * @returns Object containing position data, loading state, error, and refetch function
 */
export function usePositions(address: string): UsePositionsReturn {
  const [position, setPosition] = useState<StakerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    const trimmedAddress = typeof address === 'string' ? address.trim() : '';
    if (!trimmedAddress) {
      setPosition(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const stakerInfo = await getStakerInfo(trimmedAddress);
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

  return { position, isLoading, error, refetch: fetchPositions };
}

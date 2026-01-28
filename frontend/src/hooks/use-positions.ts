'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStakerInfo, StakerInfo } from '@/lib/staking';

export interface UsePositionsReturn {
  position: StakerInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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

  return { position, isLoading, error, refetch: fetchPositions };
}

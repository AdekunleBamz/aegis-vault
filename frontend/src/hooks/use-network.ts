'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentBlockHeight } from '@/lib/api';

export interface UseNetworkReturn {
  blockHeight: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNetwork(): UseNetworkReturn {
  const [blockHeight, setBlockHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const height = await getCurrentBlockHeight();
      setBlockHeight(height);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch network info';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkInfo();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNetworkInfo, 30000);
    return () => clearInterval(interval);
  }, [fetchNetworkInfo]);

  return { blockHeight, isLoading, error, refetch: fetchNetworkInfo };
}

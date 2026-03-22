'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCurrentBlockHeight } from '@/lib/api';
import { network } from '@/lib/stacks';

export interface UseNetworkReturn {
  blockHeight: number;
  isLoading: boolean;
  error: string | null;
  networkType: 'mainnet' | 'testnet' | 'devnet';
  refetch: () => Promise<void>;
}

export function useNetwork(): UseNetworkReturn {
  const [blockHeight, setBlockHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine network type from the imported network object
  const networkType = useMemo(() => {
    if (network.chainId === 2147483648) return 'testnet';
    if (network.chainId === 1) return 'mainnet';
    return 'devnet';
  }, []);

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

  return useMemo(() => ({
    blockHeight,
    isLoading,
    error,
    networkType,
    refetch: fetchNetworkInfo
  }), [blockHeight, isLoading, error, networkType, fetchNetworkInfo]);
}

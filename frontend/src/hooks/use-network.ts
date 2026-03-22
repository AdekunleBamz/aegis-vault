'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentBlockHeight } from '@/lib/api';
import { network } from '@/lib/stacks';

export interface UseNetworkReturn {
  blockHeight: number;
  isLoading: boolean;
  error: string | null;
  networkType: 'mainnet' | 'testnet' | 'devnet';
  refetch: () => Promise<void>;
}

/**
 * Hook to manage network information and block height tracking
 * @returns Current block height, network type, and status
 */
export function useNetwork(): UseNetworkReturn {
  const [blockHeight, setBlockHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine network type from the imported network object
  const networkType = network.chainId === 2147483648 ? 'testnet' : 'mainnet';

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

  return { blockHeight, isLoading, error, networkType, refetch: fetchNetworkInfo };
}

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCurrentBlockHeight } from '@/lib/api';
import { network } from '@/lib/stacks';

/**
 * Return type for the useNetwork hook.
 */
export interface UseNetworkReturn {
  /** The current Stacks blockchain tip height */
  blockHeight: number;
  /** Whether the network info is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, otherwise null */
  error: string | null;
  /** The type of network the app is currently connected to */
  networkType: 'mainnet' | 'testnet' | 'devnet';
  /** Function to manually trigger a network info refresh */
  refetch: () => Promise<void>;
}

/**
 * A custom hook to monitor the Stacks network status and block height.
 * Automatically polls for updates every 30 seconds.
 * 
 * @returns An object containing network status, block height, and refetch function
 */
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

'use client';

/**
 * @file Network hook for Aegis Vault
 * 
 * Provides a reusable hook for fetching and monitoring network state,
 * including current block height and network type detection.
 */

import { useState, useEffect, useCallback } from 'react';
import { getCurrentBlockHeight } from '@/lib/api';
import { network } from '@/lib/stacks';

/**
 * Return type for the useNetwork hook.
 */
export interface UseNetworkReturn {
  /** Current Stacks blockchain block height */
  blockHeight: number;
  /** Whether the network info is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, or null */
  error: string | null;
  /** The current network type (mainnet, testnet, or devnet) */
  networkType: 'mainnet' | 'testnet' | 'devnet';
  /** Function to manually refetch the network info */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching current network state.
 * Automatically refreshes every 30 seconds.
 * 
 * @returns Object containing block height, loading state, error, network type, and refetch function
 */
export function useNetwork(): UseNetworkReturn {
  const [blockHeight, setBlockHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine network type from the imported network object
  const networkType =
    network.chainId === 2147483648
      ? 'testnet'
      : network.chainId === 1
        ? 'mainnet'
        : 'devnet';

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

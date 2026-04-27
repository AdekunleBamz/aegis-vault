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

const NETWORK_TYPE: 'mainnet' | 'testnet' | 'devnet' =
  network.chainId === 2147483648
    ? 'testnet'
    : network.chainId === 1
      ? 'mainnet'
      : 'devnet';
const NETWORK_REFRESH_INTERVAL_MS = 25_000;

/**
 * Return type for the useNetwork hook.
 */
export interface UseNetworkReturn {
  /** Current Stacks blockchain block height */
  blockHeight: number | null;
  /** Whether the network info is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, or null */
  error: string | null;
  /** True when an error is currently present */
  hasError: boolean;
  /** The current network type (mainnet, testnet, or devnet) */
  networkType: 'mainnet' | 'testnet' | 'devnet';
  /** True when connected to mainnet */
  isMainnet: boolean;
  /** True when connected to testnet */
  isTestnet: boolean;
  /** True when connected to devnet/mocknet */
  isDevnet: boolean;
  /** Timestamp (ms) of the last successful block height fetch, or null */
  lastFetched: number | null;
  /** True when the last successful fetch is older than the staleness threshold */
  isStale: boolean;
  /** Function to manually refetch the network info */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching current network state.
 * Automatically refreshes every 25 seconds.
 *
 * @returns Object containing block height, loading state, error, network type, and refetch function
 */
export function useNetwork(): UseNetworkReturn {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const fetchNetworkInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const height = await getCurrentBlockHeight();
      const parsedHeight = Number(height);
      if (!Number.isFinite(parsedHeight) || parsedHeight < 0) {
        throw new Error('Received an invalid block height');
      }
      setBlockHeight(Math.floor(parsedHeight));
      setLastFetched(Date.now());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch network info';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkInfo();

    // Refresh every 25 seconds
    const interval = setInterval(fetchNetworkInfo, NETWORK_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNetworkInfo]);

  const hasError = error !== null;
  const isStale = lastFetched !== null ? Date.now() - lastFetched > 60_000 : false;

  return {
    blockHeight,
    isLoading,
    error,
    networkType: NETWORK_TYPE,
    isMainnet: NETWORK_TYPE === 'mainnet',
    isTestnet: NETWORK_TYPE === 'testnet',
    isDevnet: NETWORK_TYPE === 'devnet',
    lastFetched,
    hasError,
    isStale,
    refetch: fetchNetworkInfo,
  };
}

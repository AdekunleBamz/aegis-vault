'use client';

/**
 * @file Hook for fetching and managing token balances
 *
 * Provides real-time balance data for STX and AGS tokens
 * for a connected wallet address.
 */

import { useState, useEffect, useCallback } from 'react';
import { getAccountBalance, AccountBalance } from '@/lib/api';

/**
 * Return type for the useBalances hook.
 */
export interface UseBalancesReturn {
  stxBalance: bigint;
  agsBalance: bigint;
  /** True if the STX balance is greater than zero */
  hasStxBalance: boolean;
  /** True if the AGS balance is greater than zero */
  hasAgsBalance: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage STX and AGS token balances.
 *
 * @param address - The Stacks address to fetch balances for.
 * @returns Object containing balances, loading state, error, and refetch function.
 */
export function useBalances(address: string): UseBalancesReturn {
  const [stxBalance, setStxBalance] = useState<bigint>(0n);
  const [agsBalance, setAgsBalance] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    const trimmedAddress = typeof address === 'string' ? address.trim() : '';
    if (!trimmedAddress) {
      setStxBalance(0n);
      setAgsBalance(0n);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const balance = await getAccountBalance(trimmedAddress);
      setStxBalance(BigInt(balance.stx.balance));

      // Find AGS token balance
      const agsTokenKey = Object.keys(balance.fungible_tokens).find((key) =>
        key.includes('aegis-token')
      );

      if (agsTokenKey) {
        setAgsBalance(BigInt(balance.fungible_tokens[agsTokenKey].balance));
      } else {
        setAgsBalance(0n);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balances';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    stxBalance,
    agsBalance,
    hasStxBalance: stxBalance > 0n,
    hasAgsBalance: agsBalance > 0n,
    hasAnyBalance: stxBalance > 0n || agsBalance > 0n,
    isLoading,
    error,
    refetch: fetchBalances,
  };
}

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
  const [stxBalance, setStxBalance] = useState<bigint>(BigInt(0));
  const [agsBalance, setAgsBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const balance = await getAccountBalance(address);
      setStxBalance(BigInt(balance.stx.balance));

      // Find AGS token balance
      const agsTokenKey = Object.keys(balance.fungible_tokens).find((key) =>
        key.includes('aegis-token')
      );

      if (agsTokenKey) {
        setAgsBalance(BigInt(balance.fungible_tokens[agsTokenKey].balance));
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

  return { stxBalance, agsBalance, isLoading, error, refetch: fetchBalances };
}

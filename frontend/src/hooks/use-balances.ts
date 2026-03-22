'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAccountBalance, AccountBalance } from '@/lib/api';
import { CONTRACTS } from '@/lib/constants';

/**
 * Return type for the useBalances hook.
 */
export interface UseBalancesReturn {
  /** The user's STX balance in micro-STX (as a BigInt) */
  stxBalance: bigint;
  /** The user's AGS token balance (as a BigInt) */
  agsBalance: bigint;
  /** Whether the balances are currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, otherwise null */
  error: string | null;
  /** Function to manually trigger a balance refresh */
  refetch: () => Promise<void>;
}

/**
 * A custom hook to fetch and manage STX and AGS token balances for a Stacks address.
 * Automatically fetches balances on mount and whenever the address changes.
 * 
 * @param address - The Stacks address to fetch balances for
 * @returns An object containing balances, loading state, and refetch function
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

      // Identify the AGS token balance by matching against the known contract pattern
      const agsTokenKey = Object.keys(balance.fungible_tokens).find((key) =>
        key.includes(CONTRACTS.TOKEN_PATTERN)
      );

      if (agsTokenKey) {
        // Update state with the BigInt representation of the AGS balance
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

  return useMemo(() => ({
    stxBalance,
    agsBalance,
    isLoading,
    error,
    refetch: fetchBalances
  }), [stxBalance, agsBalance, isLoading, error, fetchBalances]);
}

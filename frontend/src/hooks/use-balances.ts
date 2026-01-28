'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccountBalance, AccountBalance } from '@/lib/api';

export interface UseBalancesReturn {
  stxBalance: bigint;
  agsBalance: bigint;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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

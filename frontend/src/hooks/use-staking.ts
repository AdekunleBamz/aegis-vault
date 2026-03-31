'use client';

/**
 * @file Hook for managing STX staking operations
 * 
 * Provides staking functionality including deposit execution,
 * loading states, and error handling.
 */

import { useState, useCallback } from 'react';
import { executeStake, TransactionResult } from '@/lib/stacks';
import { toMicroSTX } from '@/lib/format';

/**
 * Return type for the useStaking hook.
 */
export interface UseStakingReturn {
  stake: (amount: number) => Promise<TransactionResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Custom hook for managing STX staking operations.
 * 
 * @param senderAddress - The Stacks address of the current user.
 * @returns Object containing the stake function, loading state, error, and reset function.
 */
export function useStaking(senderAddress: string): UseStakingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stake = useCallback(
    async (amount: number): Promise<TransactionResult> => {
      if (!senderAddress) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const microAmount = toMicroSTX(amount);
        const result = await executeStake(microAmount, senderAddress);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stake failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [senderAddress]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return { stake, isLoading, error, reset };
}

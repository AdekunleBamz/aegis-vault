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
  /** Alias for isLoading — true while the stake transaction is pending */
  isStaking: boolean;
  error: string | null;
  /** Number of successful stake calls in this session */
  stakeCount: number;
  /** Timestamp (ms) of the most recent successful stake, or null */
  lastStakedAt: number | null;
  /** True if at least one stake has completed in this session */
  hasStaked: boolean;
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
  const [stakeCount, setStakeCount] = useState(0);
  const [lastStakedAt, setLastStakedAt] = useState<number | null>(null);

  const stake = useCallback(
    async (amount: number): Promise<TransactionResult> => {
      if (!senderAddress || typeof senderAddress !== 'string' || !senderAddress.trim()) {
        throw new Error('Wallet not connected');
      }

      if (amount <= 0) {
        throw new Error('Stake amount must be greater than zero');
      }

      setIsLoading(true);
      setError(null);

      try {
        const microAmount = toMicroSTX(amount);
        const result = await executeStake(microAmount, senderAddress);
        setStakeCount((c) => c + 1);
        setLastStakedAt(Date.now());
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

  return {
    stake,
    isLoading,
    isStaking: isLoading,
    error,
    hasError: error !== null,
    stakeCount,
    lastStakedAt,
    hasStaked: stakeCount > 0,
    reset,
  };
}

'use client';

/**
 * @file Hook for claiming staking rewards
 *
 * Provides reward claiming functionality with loading states
 * and error handling for the AGS token distribution.
 */

import { useState, useCallback } from 'react';
import { executeClaimRewards, TransactionResult } from '@/lib/stacks';

/**
 * Return type for the useRewards hook.
 */
export interface UseRewardsReturn {
  claimRewards: () => Promise<TransactionResult>;
  isLoading: boolean;
  /** Alias for isLoading — true while claim transaction is pending */
  isClaiming: boolean;
  error: string | null;
  /** True if error is not null */
  hasError: boolean;
  /** Number of successful claim calls in this session */
  claimCount: number;
  /** Timestamp (ms) of the most recent successful claim, or null */
  lastClaimedAt: number | null;
  reset: () => void;
}

/**
 * Custom hook for claiming staking rewards.
 *
 * @returns Object containing the claim function, loading state, error, and reset function.
 */
export function useRewards(): UseRewardsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimCount, setClaimCount] = useState(0);
  const [lastClaimedAt, setLastClaimedAt] = useState<number | null>(null);

  const claimRewards = useCallback(async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeClaimRewards();
      setClaimCount((c) => c + 1);
      setLastClaimedAt(Date.now());
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to claim rewards';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    claimRewards,
    isLoading,
    isClaiming: isLoading,
    error,
    hasError: error !== null,
    claimCount,
    lastClaimedAt,
    reset,
  };
}

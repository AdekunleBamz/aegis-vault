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
  error: string | null;
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

  const claimRewards = useCallback(async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeClaimRewards();
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

  return { claimRewards, isLoading, error, reset };
}

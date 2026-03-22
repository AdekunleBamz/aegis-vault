'use client';

import { useState, useCallback, useMemo } from 'react';
import { executeClaimRewards, TransactionResult } from '@/lib/stacks';

/**
 * Return type for the useRewards hook.
 */
export interface UseRewardsReturn {
  /** Function to initiate a rewards claim transaction */
  claimRewards: () => Promise<TransactionResult>;
  /** Whether a rewards claim is currently being processed */
  isLoading: boolean;
  /** Error message if the claim failed, otherwise null */
  error: string | null;
  /** Function to reset the loading and error states */
  reset: () => void;
}

/**
 * A custom hook to handle the claiming of accrued staking rewards.
 * Manages loading and error states for the reward collection process.
 * 
 * @returns An object containing the claimRewards function and transaction states
 */
export function useRewards(): UseRewardsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimRewards = useCallback(async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Execute the reward claim transaction via the connected Stacks wallet
      const result = await executeClaimRewards();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Claim rewards failed';
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

  return useMemo(() => ({
    claimRewards,
    isLoading,
    error,
    reset
  }), [claimRewards, isLoading, error, reset]);
}

'use client';

import { useState, useCallback } from 'react';
import { executeClaimRewards, TransactionResult } from '@/lib/stacks';

export interface UseRewardsReturn {
  claimRewards: () => Promise<TransactionResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useRewards(senderAddress: string): UseRewardsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimRewards = useCallback(async (): Promise<TransactionResult> => {
    if (!senderAddress) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await executeClaimRewards(senderAddress);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Claim rewards failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [senderAddress]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return { claimRewards, isLoading, error, reset };
}

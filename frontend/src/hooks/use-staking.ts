'use client';

import { useState, useCallback } from 'react';
import { executeStake, TransactionResult } from '@/lib/stacks';
import { toMicroSTX } from '@/lib/format';

export interface UseStakingReturn {
  stake: (amount: number, lockPeriodDays?: number) => Promise<TransactionResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useStaking(senderAddress: string): UseStakingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stake = useCallback(
    async (amount: number, lockPeriodDays: number = 7): Promise<TransactionResult> => {
      if (!senderAddress) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const microAmount = toMicroSTX(amount);
        const result = await executeStake(microAmount, senderAddress, lockPeriodDays);
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

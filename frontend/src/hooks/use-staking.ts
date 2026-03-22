'use client';

import { useState, useCallback } from 'react';
import { executeStake, TransactionResult } from '@/lib/stacks';
import { toMicroSTX } from '@/lib/format';

export interface UseStakingReturn {
  stake: (amount: number) => Promise<TransactionResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

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
        const rawMessage = err instanceof Error ? err.message : 'Staking transaction failed';
        const safeMessage = rawMessage.substring(0, 100).replace(/[<>]/g, '');
        setError(safeMessage);
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

'use client';

import { useState, useCallback } from 'react';
import {
  executeWithdrawRequest,
  executeWithdrawComplete,
  TransactionResult,
} from '@/lib/stacks';
import { toMicroSTX } from '@/lib/format';

export interface UseWithdrawReturn {
  requestWithdraw: (amount: number) => Promise<TransactionResult>;
  completeWithdraw: () => Promise<TransactionResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useWithdraw(): UseWithdrawReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestWithdraw = useCallback(
    async (amount: number): Promise<TransactionResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const microAmount = toMicroSTX(amount);
        const result = await executeWithdrawRequest(microAmount);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Withdraw request failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const completeWithdraw = useCallback(async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeWithdrawComplete();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Withdraw completion failed';
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

  return { requestWithdraw, completeWithdraw, isLoading, error, reset };
}

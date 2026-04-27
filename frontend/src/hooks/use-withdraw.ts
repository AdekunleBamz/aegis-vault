'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  executeWithdrawRequest,
  executeWithdrawComplete,
  TransactionResult,
} from '@/lib/stacks';
import { toMicroSTX } from '@/lib/format';

/**
 * Return type for the useWithdraw hook.
 */
export interface UseWithdrawReturn {
  /** Function to initiate a withdrawal request transaction */
  requestWithdraw: (amount: number) => Promise<TransactionResult>;
  /** Function to initiate a withdrawal completion transaction */
  completeWithdraw: () => Promise<TransactionResult>;
  /** Whether a withdrawal operation is currently being processed */
  isLoading: boolean;
  /** Error message if the operation failed, otherwise null */
  error: string | null;
  /** Function to reset the loading and error states */
  reset: () => void;
}

/**
 * A custom hook to handle withdrawal operations (request and complete).
 * Manages loading and error states for the two-step withdrawal process.
 * 
 * @returns An object containing withdrawal functions and transaction states
 */
export function useWithdraw(): UseWithdrawReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);

  const requestWithdraw = useCallback(
    async (amount: number): Promise<TransactionResult> => {
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Withdrawal amount must be greater than zero');
      }

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

  return useMemo(() => ({
    requestWithdraw,
    completeWithdraw,
    isLoading,
    error,
    reset
  }), [requestWithdraw, completeWithdraw, isLoading, error, reset]);
}

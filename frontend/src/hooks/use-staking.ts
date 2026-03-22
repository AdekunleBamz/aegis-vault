'use client';

import { useState, useCallback, useMemo } from 'react';
import { executeStake, TransactionResult } from '@/lib/stacks';
import { toMicroSTX } from '@/lib/format';

/**
 * Return type for the useStaking hook.
 */
export interface UseStakingReturn {
  /** Function to initiate a staking transaction */
  stake: (amount: number) => Promise<TransactionResult>;
  /** Whether a staking transaction is currently being processed */
  isLoading: boolean;
  /** Error message if the staking failed, otherwise null */
  error: string | null;
  /** Function to reset the loading and error states */
  reset: () => void;
}

/**
 * A custom hook to handle STX staking operations.
 * Manages loading and error states for the staking transaction process.
 * 
 * @param senderAddress - The Stacks address of the user initiating the stake
 * @returns An object containing the stake function and transaction states
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
        // Convert the user-friendly STX amount to micro-STX (10^-6)
        const microAmount = toMicroSTX(amount);
        
        // Execute the staking transaction via the Stacks provider
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

  return useMemo(() => ({
    stake,
    isLoading,
    error,
    reset
  }), [stake, isLoading, error, reset]);
}

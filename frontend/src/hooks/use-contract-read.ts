'use client';

/**
 * @file Contract read hook for Aegis Vault
 * 
 * Provides a reusable hook for calling read-only functions on Clarity smart contracts.
 * Handles loading states, error handling, and automatic refetching.
 */

import { useState, useEffect, useCallback } from 'react';
import { callReadOnlyFunction } from '@/lib/api';
import { hexToCV, cvToValue } from '@stacks/transactions';

/**
 * Return type for the useContractRead hook.
 */
export interface UseContractReadReturn<T> {
  /** The data returned from the contract call, or null if not loaded */
  data: T | null;
  /** Whether the contract call is currently in progress */
  isLoading: boolean;
  /** Error message if the call failed, or null */
  error: string | null;
  /** Function to manually refetch the data */
  refetch: () => Promise<void>;
}

/**
 * Hook for calling read-only functions on Clarity smart contracts.
 * 
 * @param contractId - Full contract ID (address.contract-name)
 * @param functionName - Name of the read-only function to call
 * @param args - Function arguments as hex-encoded strings
 * @param enabled - Whether to automatically execute the call
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useContractRead<T>(
  contractId: string,
  functionName: string,
  args: string[] = [],
  enabled = true
): UseContractReadReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !contractId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [contractAddr, contractName] = contractId.split('.');
      const result = await callReadOnlyFunction(
        contractAddr,
        contractName,
        functionName,
        args
      );

      if (result.okay && result.result) {
        const cv = hexToCV(result.result);
        const value = cvToValue(cv) as T;
        setData(value);
      } else {
        setError('Contract call returned error');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read contract';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [contractId, functionName, args, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

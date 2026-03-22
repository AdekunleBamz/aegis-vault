'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { callReadOnlyFunction } from '@/lib/api';
import { hexToCV, cvToValue } from '@stacks/transactions';

/**
 * Return type for the useContractRead hook.
 * @template T - The expected type of the returned data
 */
export interface UseContractReadReturn<T> {
  /** The data returned from the contract call, or null if loading or error */
  data: T | null;
  /** Whether the contract call is currently in progress */
  isLoading: boolean;
  /** Error message if the call failed, otherwise null */
  error: string | null;
  /** Function to manually trigger a re-read of the contract state */
  refetch: () => Promise<void>;
}

/**
 * A custom hook to read data from a Stacks smart contract using read-only functions.
 * Handles CV-to-JS value conversion and managed loading/error states.
 * 
 * @template T - The expected type of the returned data
 * @param contractId - The fully qualified contract ID (e.g., 'SP...contract-name')
 * @param functionName - The name of the read-only function to call
 * @param args - Encoded arguments for the function call (default: [])
 * @param enabled - Whether the hook should automatically fetch data (default: true)
 * @returns An object containing the read state and a refetch function
 */
export function useContractRead<T>(
  contractId: string,
  functionName: string,
  args: string[] = [],
  enabled = true
): UseContractReadReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  return useMemo(() => ({
    data,
    isLoading,
    error,
    refetch: fetchData
  }), [data, isLoading, error, fetchData]);
}

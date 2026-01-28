'use client';

import { useState, useEffect, useCallback } from 'react';
import { callReadOnlyFunction } from '@/lib/api';
import { hexToCV, cvToValue } from '@stacks/transactions';

export interface UseContractReadReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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

  return { data, isLoading, error, refetch: fetchData };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccountTransactions, Transaction } from '@/lib/api';

export interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTransactions(
  address: string,
  limit = 20
): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const txs = await getAccountTransactions(address, limit);
      // Filter for Aegis-related transactions
      const aegisTxs = txs.filter(
        (tx) =>
          tx.contract_call?.contract_id.includes('aegis-') ||
          tx.contract_call?.contract_id.includes('aegis-vault')
      );
      setTransactions(aegisTxs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [address, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, isLoading, error, refetch: fetchTransactions };
}

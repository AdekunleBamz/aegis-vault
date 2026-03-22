'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAccountTransactions, Transaction } from '@/lib/api';

/**
 * Return type for the useTransactions hook.
 */
export interface UseTransactionsReturn {
  /** A list of recent transactions filtered for Aegis Protocol interactions */
  transactions: Transaction[];
  /** Whether the transaction history is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, otherwise null */
  error: string | null;
  /** Function to manually trigger a history refresh */
  refetch: () => Promise<void>;
}

/**
 * A custom hook to fetch and filter a user's transaction history on the Stacks blockchain.
 * Specifically looks for contract calls to the Aegis Protocol contracts.
 * 
 * @param address - The Stacks address whose transactions to retrieve
 * @param limit - Maximum number of recent transactions to query (default: 20)
 * @returns An object containing filtered transactions and loading states
 */
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

  return useMemo(() => ({ 
    transactions, 
    isLoading, 
    error, 
    refetch: fetchTransactions 
  }), [transactions, isLoading, error, fetchTransactions]);
}

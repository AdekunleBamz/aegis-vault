'use client';

/**
 * @file Transactions hook for Aegis Vault
 * 
 * Provides a reusable hook for fetching and managing transaction history
 * for a given wallet address, filtered for Aegis protocol interactions.
 */

import { useState, useEffect, useCallback } from 'react';
import { getAccountTransactions, Transaction } from '@/lib/api';

/**
 * Return type for the useTransactions hook.
 */
export interface UseTransactionsReturn {
  /** Array of transactions for the given address */
  transactions: Transaction[];
  /** Whether the transactions are currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed, or null */
  error: string | null;
  /** Function to manually refetch the transactions */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a user's transaction history.
 * Automatically filters for Aegis protocol-related transactions.
 * 
 * @param address - The Stacks address to fetch transactions for
 * @param limit - Maximum number of transactions to fetch (default: 20)
 * @returns Object containing transactions, loading state, error, and refetch function
 */
export function useTransactions(
  address: string,
  limit = 20
): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(!!address);
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

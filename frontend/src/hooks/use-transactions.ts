import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/constants';

export interface Transaction {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  block_height: number;
  burn_block_time: number;
  sender_address: string;
  fee_rate: string;
  contract_call?: {
    contract_id: string;
    function_name: string;
    function_args?: Array<{
      name: string;
      repr: string;
      type: string;
    }>;
  };
}

export interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export function useTransactions(address: string | null, limit = 20) {
  const [state, setState] = useState<TransactionsState>({
    transactions: [],
    isLoading: false,
    error: null,
    hasMore: false,
  });
  const [offset, setOffset] = useState(0);

  const fetchTransactions = useCallback(
    async (reset = false) => {
      if (!address) {
        setState({
          transactions: [],
          isLoading: false,
          error: null,
          hasMore: false,
        });
        return;
      }

      const currentOffset = reset ? 0 : offset;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(
          `${API_BASE_URL}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${currentOffset}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        const newTransactions: Transaction[] = data.results || [];

        setState((prev) => ({
          transactions: reset
            ? newTransactions
            : [...prev.transactions, ...newTransactions],
          isLoading: false,
          error: null,
          hasMore: newTransactions.length === limit,
        }));

        if (reset) {
          setOffset(limit);
        } else {
          setOffset((prev) => prev + limit);
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch transactions',
        }));
      }
    },
    [address, limit, offset]
  );

  useEffect(() => {
    fetchTransactions(true);
  }, [address]);

  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      fetchTransactions(false);
    }
  }, [fetchTransactions, state.isLoading, state.hasMore]);

  const refresh = useCallback(() => {
    setOffset(0);
    fetchTransactions(true);
  }, [fetchTransactions]);

  return { ...state, loadMore, refresh };
}

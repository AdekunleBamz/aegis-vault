import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { CONTRACTS, API_BASE_URL } from '@/lib/constants';

export interface TokenBalance {
  balance: string;
  total_sent: string;
  total_received: string;
}

export interface BalancesState {
  stx: number;
  ags: number;
  isLoading: boolean;
  error: string | null;
}

export function useBalances() {
  const { address, isConnected } = useWallet();
  const [state, setState] = useState<BalancesState>({
    stx: 0,
    ags: 0,
    isLoading: false,
    error: null,
  });

  const fetchBalances = useCallback(async () => {
    if (!isConnected || !address) {
      setState({ stx: 0, ags: 0, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/extended/v1/address/${address}/balances`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch balances');
      }

      const data = await response.json();

      // STX balance (in microSTX)
      const stxBalance = Number(data.stx?.balance || 0) / 1_000_000;

      // AGS token balance
      const agsTokenId = `${CONTRACTS.TOKEN.address}.${CONTRACTS.TOKEN.name}::aegis-token`;
      const agsBalance =
        Number(data.fungible_tokens?.[agsTokenId]?.balance || 0) / 1_000_000;

      setState({
        stx: stxBalance,
        ags: agsBalance,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balances',
      }));
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Refresh every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [fetchBalances, isConnected]);

  return { ...state, refetch: fetchBalances };
}

import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/constants';

export interface BlockInfo {
  height: number;
  hash: string;
  block_time: number;
  txs: number;
}

export interface NetworkStats {
  currentBlock: number;
  avgBlockTime: number;
  isLoading: boolean;
  error: string | null;
}

export function useNetworkStats() {
  const [state, setState] = useState<NetworkStats>({
    currentBlock: 0,
    avgBlockTime: 600, // ~10 minutes for Stacks
    isLoading: false,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/extended/v1/block?limit=1`);

      if (!response.ok) {
        throw new Error('Failed to fetch network stats');
      }

      const data = await response.json();
      const latestBlock = data.results?.[0];

      setState({
        currentBlock: latestBlock?.height || 0,
        avgBlockTime: 600,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { ...state, refetch: fetchStats };
}

export function useBlockCountdown(targetBlock: number) {
  const { currentBlock, avgBlockTime } = useNetworkStats();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!currentBlock || !targetBlock) {
      setTimeRemaining('--');
      return;
    }

    const blocksRemaining = targetBlock - currentBlock;

    if (blocksRemaining <= 0) {
      setTimeRemaining('Ready');
      return;
    }

    const secondsRemaining = blocksRemaining * avgBlockTime;
    const days = Math.floor(secondsRemaining / 86400);
    const hours = Math.floor((secondsRemaining % 86400) / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else {
      setTimeRemaining(`${minutes}m`);
    }
  }, [currentBlock, targetBlock, avgBlockTime]);

  return {
    timeRemaining,
    blocksRemaining: targetBlock - currentBlock,
    isReady: currentBlock >= targetBlock,
  };
}

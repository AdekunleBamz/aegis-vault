import { useState, useCallback } from 'react';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { CONTRACTS } from '@/lib/constants';
import { useWallet } from './use-wallet';

export interface RewardsState {
  isLoading: boolean;
  error: string | null;
  txId: string | null;
}

export function useRewards() {
  const { address, isConnected } = useWallet();
  const [state, setState] = useState<RewardsState>({
    isLoading: false,
    error: null,
    txId: null,
  });

  const claimRewards = useCallback(
    async (stakeId: number) => {
      if (!isConnected || !address) {
        setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
        return;
      }

      setState({ isLoading: true, error: null, txId: null });

      try {
        await openContractCall({
          contractAddress: CONTRACTS.REWARDS.address,
          contractName: CONTRACTS.REWARDS.name,
          functionName: 'claim-rewards',
          functionArgs: [uintCV(stakeId)],
          postConditionMode: PostConditionMode.Deny,
          onFinish: (data) => {
            setState({
              isLoading: false,
              error: null,
              txId: data.txId,
            });
          },
          onCancel: () => {
            setState({
              isLoading: false,
              error: 'Transaction cancelled',
              txId: null,
            });
          },
        });
      } catch (error) {
        setState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Claim failed',
          txId: null,
        });
      }
    },
    [address, isConnected]
  );

  const claimAllRewards = useCallback(
    async (stakeIds: number[]) => {
      if (!isConnected || !address) {
        setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
        return;
      }

      if (stakeIds.length === 0) {
        setState((prev) => ({ ...prev, error: 'No stakes to claim' }));
        return;
      }

      setState({ isLoading: true, error: null, txId: null });

      try {
        // Claim first stake (multi-call would require custom contract)
        await openContractCall({
          contractAddress: CONTRACTS.REWARDS.address,
          contractName: CONTRACTS.REWARDS.name,
          functionName: 'claim-rewards',
          functionArgs: [uintCV(stakeIds[0])],
          postConditionMode: PostConditionMode.Deny,
          onFinish: (data) => {
            setState({
              isLoading: false,
              error: null,
              txId: data.txId,
            });
          },
          onCancel: () => {
            setState({
              isLoading: false,
              error: 'Transaction cancelled',
              txId: null,
            });
          },
        });
      } catch (error) {
        setState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Claim all failed',
          txId: null,
        });
      }
    },
    [address, isConnected]
  );

  const resetState = useCallback(() => {
    setState({ isLoading: false, error: null, txId: null });
  }, []);

  return {
    ...state,
    claimRewards,
    claimAllRewards,
    resetState,
  };
}

import { useState, useCallback } from 'react';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { CONTRACTS } from '@/lib/constants';
import { useWallet } from './use-wallet';

export interface WithdrawState {
  isLoading: boolean;
  error: string | null;
  txId: string | null;
}

export function useWithdraw() {
  const { address, isConnected } = useWallet();
  const [state, setState] = useState<WithdrawState>({
    isLoading: false,
    error: null,
    txId: null,
  });

  const initiateWithdraw = useCallback(
    async (stakeId: number) => {
      if (!isConnected || !address) {
        setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
        return;
      }

      setState({ isLoading: true, error: null, txId: null });

      try {
        await openContractCall({
          contractAddress: CONTRACTS.WITHDRAWALS.address,
          contractName: CONTRACTS.WITHDRAWALS.name,
          functionName: 'initiate-withdraw',
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
          error: error instanceof Error ? error.message : 'Withdraw initiation failed',
          txId: null,
        });
      }
    },
    [address, isConnected]
  );

  const completeWithdraw = useCallback(
    async (stakeId: number) => {
      if (!isConnected || !address) {
        setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
        return;
      }

      setState({ isLoading: true, error: null, txId: null });

      try {
        await openContractCall({
          contractAddress: CONTRACTS.WITHDRAWALS.address,
          contractName: CONTRACTS.WITHDRAWALS.name,
          functionName: 'complete-withdraw',
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
          error: error instanceof Error ? error.message : 'Withdraw completion failed',
          txId: null,
        });
      }
    },
    [address, isConnected]
  );

  const cancelWithdraw = useCallback(
    async (stakeId: number) => {
      if (!isConnected || !address) {
        setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
        return;
      }

      setState({ isLoading: true, error: null, txId: null });

      try {
        await openContractCall({
          contractAddress: CONTRACTS.WITHDRAWALS.address,
          contractName: CONTRACTS.WITHDRAWALS.name,
          functionName: 'cancel-withdraw',
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
          error: error instanceof Error ? error.message : 'Withdraw cancellation failed',
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
    initiateWithdraw,
    completeWithdraw,
    cancelWithdraw,
    resetState,
  };
}

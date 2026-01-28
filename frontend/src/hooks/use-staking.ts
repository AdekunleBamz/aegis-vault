import { useState, useCallback } from 'react';
import {
  makeContractCall,
  uintCV,
  PostConditionMode,
  AnchorMode,
  broadcastTransaction,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { CONTRACTS, STAKING_TIERS } from '@/lib/constants';
import { useWallet } from './use-wallet';

export interface StakeParams {
  amount: number;
  tierLevel: number;
}

export interface StakingState {
  isLoading: boolean;
  error: string | null;
  txId: string | null;
}

export function useStaking() {
  const { address, isConnected } = useWallet();
  const [state, setState] = useState<StakingState>({
    isLoading: false,
    error: null,
    txId: null,
  });

  const stake = useCallback(
    async ({ amount, tierLevel }: StakeParams) => {
      if (!isConnected || !address) {
        setState((prev) => ({ ...prev, error: 'Wallet not connected' }));
        return;
      }

      const tier = STAKING_TIERS.find((t) => t.level === tierLevel);
      if (!tier) {
        setState((prev) => ({ ...prev, error: 'Invalid tier selected' }));
        return;
      }

      if (amount < tier.minStake) {
        setState((prev) => ({
          ...prev,
          error: `Minimum stake for ${tier.name} is ${tier.minStake} STX`,
        }));
        return;
      }

      setState({ isLoading: true, error: null, txId: null });

      try {
        const amountMicroStx = BigInt(amount * 1_000_000);
        
        const postConditions = [
          makeStandardSTXPostCondition(
            address,
            FungibleConditionCode.LessEqual,
            amountMicroStx
          ),
        ];

        await openContractCall({
          contractAddress: CONTRACTS.STAKING.address,
          contractName: CONTRACTS.STAKING.name,
          functionName: 'stake',
          functionArgs: [uintCV(amountMicroStx), uintCV(tierLevel)],
          postConditions,
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
          error: error instanceof Error ? error.message : 'Staking failed',
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
    stake,
    resetState,
  };
}

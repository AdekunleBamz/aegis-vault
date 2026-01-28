import { useState, useEffect, useCallback } from 'react';
import { callReadOnlyFunction, principalCV, uintCV, cvToJSON } from '@stacks/transactions';
import { CONTRACTS, NETWORK, STAKING_TIERS } from '@/lib/constants';
import { useWallet } from './use-wallet';
import { StakingPosition } from '@/types/staking';

export interface PositionsState {
  positions: StakingPosition[];
  isLoading: boolean;
  error: string | null;
}

export function usePositions() {
  const { address, isConnected } = useWallet();
  const [state, setState] = useState<PositionsState>({
    positions: [],
    isLoading: false,
    error: null,
  });

  const fetchPositions = useCallback(async () => {
    if (!isConnected || !address) {
      setState({ positions: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get user stake IDs
      const stakeIdsResult = await callReadOnlyFunction({
        contractAddress: CONTRACTS.STAKING.address,
        contractName: CONTRACTS.STAKING.name,
        functionName: 'get-user-stake-ids',
        functionArgs: [principalCV(address)],
        senderAddress: address,
        network: NETWORK,
      });

      const stakeIdsJson = cvToJSON(stakeIdsResult);
      const stakeIds: number[] = (stakeIdsJson.value || []).map(
        (item: { value: string }) => parseInt(item.value)
      );

      if (stakeIds.length === 0) {
        setState({ positions: [], isLoading: false, error: null });
        return;
      }

      // Fetch info for each stake
      const positions: StakingPosition[] = await Promise.all(
        stakeIds.map(async (stakeId) => {
          const stakeInfoResult = await callReadOnlyFunction({
            contractAddress: CONTRACTS.STAKING.address,
            contractName: CONTRACTS.STAKING.name,
            functionName: 'get-stake-info',
            functionArgs: [uintCV(stakeId)],
            senderAddress: address,
            network: NETWORK,
          });

          const stakeInfo = cvToJSON(stakeInfoResult);
          const value = stakeInfo.value?.value || stakeInfo.value;

          const tierLevel = parseInt(value?.tier?.value || '1');
          const tier = STAKING_TIERS.find((t) => t.level === tierLevel);

          // Get pending rewards
          let pendingRewards = 0;
          try {
            const rewardsResult = await callReadOnlyFunction({
              contractAddress: CONTRACTS.REWARDS.address,
              contractName: CONTRACTS.REWARDS.name,
              functionName: 'get-pending-rewards',
              functionArgs: [uintCV(stakeId)],
              senderAddress: address,
              network: NETWORK,
            });
            const rewardsJson = cvToJSON(rewardsResult);
            pendingRewards = parseInt(rewardsJson.value?.value || '0') / 1_000_000;
          } catch {
            // Rewards contract may not be deployed
          }

          return {
            id: stakeId,
            amount: parseInt(value?.amount?.value || '0') / 1_000_000,
            tier: tier || STAKING_TIERS[0],
            startBlock: parseInt(value?.['start-block']?.value || '0'),
            endBlock: parseInt(value?.['end-block']?.value || '0'),
            rewards: pendingRewards,
            status: value?.status?.value || 'active',
          };
        })
      );

      setState({ positions, isLoading: false, error: null });
    } catch (error) {
      setState({
        positions: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch positions',
      });
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Refresh every minute
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(fetchPositions, 60000);
    return () => clearInterval(interval);
  }, [fetchPositions, isConnected]);

  return { ...state, refetch: fetchPositions };
}

import { useState, useEffect, useCallback } from 'react';
import {
  callReadOnlyFunction,
  principalCV,
  uintCV,
  cvToJSON,
  ClarityValue,
} from '@stacks/transactions';
import { CONTRACTS, NETWORK } from '@/lib/constants';

export interface ContractReadOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderAddress?: string;
}

export interface ContractReadState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useContractRead<T = unknown>(
  options: ContractReadOptions | null
) {
  const [state, setState] = useState<ContractReadState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!options) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await callReadOnlyFunction({
        contractAddress: options.contractAddress,
        contractName: options.contractName,
        functionName: options.functionName,
        functionArgs: options.functionArgs,
        senderAddress: options.senderAddress || options.contractAddress,
        network: NETWORK,
      });

      const jsonResult = cvToJSON(result);
      setState({
        data: jsonResult as T,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Read failed',
      });
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Specialized hooks for common reads

export function useUserStakeIds(address: string | null) {
  return useContractRead<{ value: { value: string }[] }>(
    address
      ? {
          contractAddress: CONTRACTS.STAKING.address,
          contractName: CONTRACTS.STAKING.name,
          functionName: 'get-user-stake-ids',
          functionArgs: [principalCV(address)],
          senderAddress: address,
        }
      : null
  );
}

export function useStakeInfo(stakeId: number | null) {
  return useContractRead(
    stakeId !== null
      ? {
          contractAddress: CONTRACTS.STAKING.address,
          contractName: CONTRACTS.STAKING.name,
          functionName: 'get-stake-info',
          functionArgs: [uintCV(stakeId)],
        }
      : null
  );
}

export function useTotalStaked() {
  return useContractRead<{ value: string }>({
    contractAddress: CONTRACTS.STAKING.address,
    contractName: CONTRACTS.STAKING.name,
    functionName: 'get-total-staked',
    functionArgs: [],
  });
}

export function useTreasuryBalance() {
  return useContractRead<{ value: string }>({
    contractAddress: CONTRACTS.TREASURY.address,
    contractName: CONTRACTS.TREASURY.name,
    functionName: 'get-treasury-balance',
    functionArgs: [],
  });
}

export function usePendingRewards(stakeId: number | null) {
  return useContractRead(
    stakeId !== null
      ? {
          contractAddress: CONTRACTS.REWARDS.address,
          contractName: CONTRACTS.REWARDS.name,
          functionName: 'get-pending-rewards',
          functionArgs: [uintCV(stakeId)],
        }
      : null
  );
}

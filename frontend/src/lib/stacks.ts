/**
 * @file Stacks blockchain interaction utilities for Aegis Vault
 * 
 * Provides functions for executing smart contract transactions on the
 * Stacks blockchain, including staking, withdrawals, and reward claims.
 */

import { STACKS_MAINNET } from '@stacks/network';
// Note: If Vercel still fails, we may need to use new StacksMainnet() from a different subpath
import {
  openContractCall,
  ContractCallOptions,
  FinishedTxData,
} from '@stacks/connect';
import {
  uintCV,
  
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { CONTRACTS } from './constants';

const network = STACKS_MAINNET;

/**
 * Result of a blockchain transaction submission.
 */
export interface TransactionResult {
  /** The transaction ID hash */
  txId: string;
  /** Whether the transaction was successfully submitted */
  success: boolean;
}

/**
 * Execute stake transaction
 * 
 * @param amount - Amount in microSTX to stake.
 * @param senderAddress - The address of the staker.
 * @returns Promise resolving to the transaction ID and success status.
 */
export async function executeStake(
  amount: bigint,
  senderAddress: string
): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const postConditions = [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        amount
      ),
    ];

    const { STAKING } = CONTRACTS;
    const [contractAddr, contractName] = STAKING.split('.');

    const options: ContractCallOptions = {
      network,
      contractAddress: contractAddr,
      contractName,
      functionName: 'stake',
      functionArgs: [uintCV(amount)],
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options);
  });
}

/**
 * Execute a withdrawal request from a staking position.
 * 
 * @param amount - Amount in microSTX to request withdrawal of.
 * @returns Promise resolving to the transaction ID and success status.
 */
export async function executeWithdrawRequest(
  amount: bigint
): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const [contractAddr, contractName] = CONTRACTS.WITHDRAWALS.split('.');

    const options: ContractCallOptions = {
      network,
      contractAddress: contractAddr,
      contractName,
      functionName: 'request-withdrawal',
      functionArgs: [uintCV(amount)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options);
  });
}

/**
 * Complete a pending withdrawal request.
 * 
 * @returns Promise resolving to the transaction ID and success status.
 */
export async function executeWithdrawComplete(): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const [contractAddr, contractName] = CONTRACTS.VAULT.split('.');

    const options: ContractCallOptions = {
      network,
      contractAddress: contractAddr,
      contractName,
      functionName: 'complete-withdrawal',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options);
  });
}

/**
 * Claim accumulated staking rewards.
 * 
 * @returns Promise resolving to the transaction ID and success status.
 */
export async function executeClaimRewards(): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const [contractAddr, contractName] = CONTRACTS.REWARDS.split('.');

    const options: ContractCallOptions = {
      network,
      contractAddress: contractAddr,
      contractName,
      functionName: 'claim-rewards',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options);
  });
}

export { network };

import { StacksMainnet } from '@stacks/network';
import {
  openContractCall,
  ContractCallOptions,
  FinishedTxData,
} from '@stacks/connect';
import {
  uintCV,
  principalCV,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { CONTRACTS } from './constants';

const network = new StacksMainnet();

export interface TransactionResult {
  txId: string;
  success: boolean;
}

/**
 * Execute stake transaction
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

    const [contractAddr, contractName] = CONTRACTS.STAKING.split('.');
    
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
 * Execute unstake/withdraw request
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
 * Execute withdraw completion
 */
export async function executeWithdrawComplete(): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const [contractAddr, contractName] = CONTRACTS.WITHDRAWALS.split('.');
    
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
 * Execute claim rewards
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

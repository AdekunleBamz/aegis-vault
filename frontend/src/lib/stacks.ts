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

export interface TransactionResult {
  txId: string;
  success: boolean;
}

/**
 * Executes a staking transaction on the Stacks blockchain.
 * 
 * @param amount - Amount in microSTX.
 * @param senderAddress - The address of the staker.
 * @returns Promise resolving to the transaction ID and success status.
 */
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

    const { STAKING } = CONTRACTS;\n    const [contractAddr, contractName] = STAKING.split('.');

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

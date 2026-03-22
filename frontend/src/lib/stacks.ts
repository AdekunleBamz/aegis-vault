import { STACKS_MAINNET } from '@stacks/network';
// Note: If Vercel still fails, we may need to use new StacksMainnet() from a different subpath
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

const network = STACKS_MAINNET;

/**
 * Standard Result object for Aegis Vault blockchain transactions.
 */
export interface TransactionResult {
  /** The unique Stacks transaction ID (hash) */
  txId: string;
  /** Whether the transaction was successfully broadcast to the mempool */
  success: boolean;
}

/**
 * Executes a staking transaction to the Aegis Staking contract.
 * Sets up the required STX post-condition and opens the Stacks Connect contract call modal.
 * 
 * @param amount - The amount to stake in micro-STX (uSTX)
 * @param senderAddress - The Stacks address of the sender
 * @returns A promise that resolves to a TransactionResult with txId and success status
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
 * Initiates a withdrawal request in the Aegis Withdrawals contract.
 * Users must request a withdrawal before they can complete it after the cooling period.
 * 
 * @param amount - The amount to request for withdrawal in micro-STX (uSTX)
 * @returns A promise that resolves to a TransactionResult with txId and success status
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
 * Completes a previously requested withdrawal after the cooling period has passed.
 * Transfers the STX from the Aegis Withdrawals contract back to the user.
 * 
 * @returns A promise that resolves to a TransactionResult with txId and success status
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
 * Claims any accrued AGS rewards from the Aegis Rewards contract.
 * Rewards are calculated based on the user's staked amount and duration.
 * 
 * @returns A promise that resolves to a TransactionResult with txId and success status
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

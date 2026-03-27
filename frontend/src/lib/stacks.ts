import {
  openContractCall,
  ContractCallOptions,
  FinishedTxData,
} from '@stacks/connect';
import { aegisSdk, DEFAULT_LOCK_PERIOD_DAYS } from './sdk';
import { getBestClaimStakeId, getStakeIdForExactAmount } from './staking';

const network = aegisSdk.stacksNetwork;

export interface TransactionResult {
  txId: string;
  success: boolean;
}

/**
 * Execute stake transaction
 */
export async function executeStake(
  amount: bigint,
  senderAddress: string,
  lockPeriodDays: number = DEFAULT_LOCK_PERIOD_DAYS
): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const sdkOptions = aegisSdk.buildStakeTxOptions(amount, lockPeriodDays, senderAddress);

    const options = {
      ...(sdkOptions as unknown as Record<string, unknown>),
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options as ContractCallOptions);
  });
}

/**
 * Execute unstake/withdraw request
 */
export async function executeWithdrawRequest(
  amount: bigint,
  senderAddress: string
): Promise<TransactionResult> {
  if (!senderAddress) {
    throw new Error('Wallet not connected');
  }

  const stakeId = await getStakeIdForExactAmount(senderAddress, amount);
  if (!stakeId) {
    throw new Error(
      'Withdrawals currently require an exact active stake amount. Use one of your exact position amounts.'
    );
  }

  return new Promise((resolve, reject) => {
    const sdkOptions = aegisSdk.buildRequestWithdrawalTxOptions(stakeId);

    const options = {
      ...(sdkOptions as unknown as Record<string, unknown>),
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options as ContractCallOptions);
  });
}

/**
 * Execute withdraw completion
 */
export async function executeWithdrawComplete(): Promise<TransactionResult> {
  return new Promise((resolve, reject) => {
    const sdkOptions = aegisSdk.buildCompleteWithdrawalTxOptions();

    const options = {
      ...(sdkOptions as unknown as Record<string, unknown>),
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options as ContractCallOptions);
  });
}

/**
 * Execute claim rewards
 */
export async function executeClaimRewards(senderAddress: string): Promise<TransactionResult> {
  if (!senderAddress) {
    throw new Error('Wallet not connected');
  }

  const stakeId = await getBestClaimStakeId(senderAddress);
  if (!stakeId) {
    throw new Error('No active stake with claimable rewards found.');
  }

  return new Promise((resolve, reject) => {
    const sdkOptions = aegisSdk.buildClaimRewardsTxOptions(stakeId);

    const options = {
      ...(sdkOptions as unknown as Record<string, unknown>),
      onFinish: (data: FinishedTxData) => {
        resolve({ txId: data.txId, success: true });
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    };

    openContractCall(options as ContractCallOptions);
  });
}

export { network };

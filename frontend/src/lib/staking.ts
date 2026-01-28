import { CONTRACTS, TIERS, BLOCKS_PER_YEAR } from './constants';
import { callReadOnlyFunction } from './api';
import { cvToValue, hexToCV } from '@stacks/transactions';

export interface StakerInfo {
  amountStaked: bigint;
  stakeStartBlock: number;
  lastRewardBlock: number;
  pendingRewards: bigint;
  tier: number;
}

export interface PoolStats {
  totalStaked: bigint;
  totalStakers: number;
  rewardRate: bigint;
  lastDistributionBlock: number;
}

/**
 * Get staker information from the contract
 */
export async function getStakerInfo(address: string): Promise<StakerInfo | null> {
  try {
    const [contractAddr, contractName] = CONTRACTS.STAKING.split('.');
    const result = await callReadOnlyFunction(
      contractAddr,
      contractName,
      'get-staker-info',
      [`0x${Buffer.from(address).toString('hex')}`]
    );
    
    if (!result.okay || !result.result) {
      return null;
    }
    
    const cv = hexToCV(result.result);
    const value = cvToValue(cv);
    
    if (!value) return null;
    
    return {
      amountStaked: BigInt(value['amount-staked'] || 0),
      stakeStartBlock: Number(value['stake-start-block'] || 0),
      lastRewardBlock: Number(value['last-reward-block'] || 0),
      pendingRewards: BigInt(value['pending-rewards'] || 0),
      tier: Number(value['tier'] || 0),
    };
  } catch (error) {
    console.error('Failed to get staker info:', error);
    return null;
  }
}

/**
 * Get pool statistics
 */
export async function getPoolStats(): Promise<PoolStats | null> {
  try {
    const [contractAddr, contractName] = CONTRACTS.STAKING.split('.');
    const result = await callReadOnlyFunction(
      contractAddr,
      contractName,
      'get-pool-stats',
      []
    );
    
    if (!result.okay || !result.result) {
      return null;
    }
    
    const cv = hexToCV(result.result);
    const value = cvToValue(cv);
    
    return {
      totalStaked: BigInt(value['total-staked'] || 0),
      totalStakers: Number(value['total-stakers'] || 0),
      rewardRate: BigInt(value['reward-rate'] || 0),
      lastDistributionBlock: Number(value['last-distribution-block'] || 0),
    };
  } catch (error) {
    console.error('Failed to get pool stats:', error);
    return null;
  }
}

/**
 * Calculate APY based on stake amount and tier
 */
export function calculateAPY(stakeAmount: bigint, tier: number): number {
  const baseAPY = 12; // 12% base APY
  const tierMultiplier = TIERS[tier]?.multiplier || 1;
  return baseAPY * tierMultiplier;
}

/**
 * Calculate estimated rewards for a period
 */
export function calculateEstimatedRewards(
  stakeAmount: bigint,
  apy: number,
  blocks: number
): bigint {
  const yearlyRewards = (Number(stakeAmount) * apy) / 100;
  const blockRewards = (yearlyRewards * blocks) / BLOCKS_PER_YEAR;
  return BigInt(Math.floor(blockRewards));
}

/**
 * Determine tier based on stake amount
 */
export function determineTier(stakeAmount: bigint): number {
  const stakeSTX = Number(stakeAmount) / 1e6;
  
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (stakeSTX >= TIERS[i].minStake) {
      return i;
    }
  }
  
  return 0;
}

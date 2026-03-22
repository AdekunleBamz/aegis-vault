import { CONTRACTS, TIERS, BLOCKS_PER_YEAR, MICRO_STX_DENOMINATOR } from './constants';
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
 * Retrieves staker information for a given Stacks address.
 * Queries the smart contract and parses the result into a StakerInfo object.
 * 
 * @param address - The Stacks address of the staker
 * @returns A Promise that resolves to StakerInfo if found, or null otherwise
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
 * Retrieves global staking pool statistics.
 * Provides insights into total value locked and active staker count.
 * 
 * @returns A Promise that resolves to PoolStats if found, or null otherwise
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
 * Calculates current APY based on the user's staking amount and reward tier.
 * Tiers provide multipliers that boost the base protocol APY.
 * 
 * @param stakeAmount - The amount of STX currently staked (as micro-STX)
 * @param tier - The current reward tier index
 * @returns The calculated APY percentage as a number
 */
export function calculateAPY(stakeAmount: bigint, tier: number): number {
  const baseAPY = TIERS[0]?.baseApy || 12;
  const tierMultiplier = TIERS[tier]?.multiplier || 1;
  return baseAPY * tierMultiplier;
}

/**
 * Calculates estimated rewards for a given duration in blocks.
 * Uses the annual percentage yield and principal amount to derive local rewards.
 * 
 * @param stakeAmount - The principal amount staked (as micro-STX)
 * @param apy - The annual percentage yield to apply
 * @param blocks - The duration in Stacks blocks for the estimate
 * @returns The estimated reward amount in micro-AGS units
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
 * Determines the appropriate reward tier for a given staking amount.
 * Iterates through the predefined TIERS constant to find the highest eligible level.
 * 
 * @param stakeAmount - The amount of STX (as micro-STX)
 * @returns The index of the earned reward tier
 */
export function determineTier(stakeAmount: bigint): number {
  const stakeSTX = Number(stakeAmount) / MICRO_STX_DENOMINATOR;
  
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (stakeSTX >= TIERS[i].minStake) {
      return i;
    }
  }
  
  return 0;
}

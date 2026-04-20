/**
 * @file Staking utilities for Aegis Vault
 *
 * Provides functions for interacting with the Aegis Staking protocol,
 * including staker info retrieval, APY calculation, tier determination,
 * and reward estimation.
 *
 * @author Aegis Vault Team
 */
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
  const clampedTier = Math.max(0, Math.min(tier, TIERS.length - 1));
  const baseAPY = TIERS[clampedTier]?.baseApy || 12;
  const tierMultiplier = TIERS[clampedTier]?.multiplier || 1.0;
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

/**
 * Get tier object by its name (e.g. 'Bronze')
 */
export function getTierByName(name: string): (typeof TIERS)[number] {
  return TIERS.find(t => t.name === name) || TIERS[0];
}

/**
 * Convert microSTX stake amount to a human-readable STX value.
 *
 * @param microStx - Amount in microSTX
 * @returns Amount in STX as a floating-point number
 */
export function stakeAmountToSTX(microStx: bigint): number {
  return Number(microStx) / 1e6;
}

/**
 * Returns true if the staker has an active stake (amount > 0).
 *
 * @param info - StakerInfo from getStakerInfo
 * @returns True when the staker currently has funds staked
 */
export function isActiveStaker(info: StakerInfo | null): boolean {
  return info !== null && info.amountStaked > 0n;
}

/**
 * Returns true if the staker has pending rewards to claim.
 *
 * @param info - StakerInfo from getStakerInfo
 * @returns True when pendingRewards is greater than zero
 */
export function hasClaimableRewards(info: StakerInfo | null): boolean {
  return info !== null && info.pendingRewards > 0n;
}

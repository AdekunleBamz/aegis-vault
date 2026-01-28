import { STAKING_TIERS } from './constants';
import type { StakingTier } from '@/types/staking';

// Validate staking amount against tier requirements
export function validateStakeAmount(amount: number, tier: StakingTier): {
  valid: boolean;
  error?: string;
} {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (amount < tier.minStake) {
    return {
      valid: false,
      error: `Minimum stake for ${tier.name} tier is ${tier.minStake} STX`,
    };
  }

  if (tier.maxStake && amount > tier.maxStake) {
    return {
      valid: false,
      error: `Maximum stake for ${tier.name} tier is ${tier.maxStake} STX`,
    };
  }

  return { valid: true };
}

// Get tier by level
export function getTierByLevel(level: number): StakingTier | undefined {
  return STAKING_TIERS.find((tier) => tier.level === level);
}

// Get recommended tier based on amount
export function getRecommendedTier(amount: number): StakingTier {
  // Find the highest tier the amount qualifies for
  const qualifyingTiers = STAKING_TIERS.filter(
    (tier) => amount >= tier.minStake && (!tier.maxStake || amount <= tier.maxStake)
  );

  if (qualifyingTiers.length === 0) {
    return STAKING_TIERS[0]; // Default to Bronze
  }

  // Return tier with highest APY
  return qualifyingTiers.reduce((best, current) =>
    current.apy > best.apy ? current : best
  );
}

// Calculate estimated rewards for a stake
export function estimateRewards(
  amount: number,
  tier: StakingTier,
  days: number
): {
  stxRewards: number;
  agsRewards: number;
  totalValue: number;
} {
  const dailyRate = tier.apy / 365 / 100;
  const stxRewards = amount * dailyRate * days;
  
  // AGS bonus (example: 0.1 AGS per STX per year at tier level multiplier)
  const agsRate = 0.1 * tier.level;
  const agsRewards = (amount * agsRate * days) / 365;

  return {
    stxRewards,
    agsRewards,
    totalValue: stxRewards, // Assuming 1 AGS = 0 USD for now
  };
}

// Calculate unlock block for a stake
export function calculateUnlockBlock(
  startBlock: number,
  tier: StakingTier
): number {
  return startBlock + tier.lockPeriod;
}

// Check if a stake is unlockable
export function isStakeUnlockable(
  currentBlock: number,
  endBlock: number
): boolean {
  return currentBlock >= endBlock;
}

// Calculate time remaining until unlock
export function getTimeUntilUnlock(
  currentBlock: number,
  endBlock: number
): {
  blocks: number;
  estimatedSeconds: number;
  isReady: boolean;
} {
  const blocksRemaining = Math.max(0, endBlock - currentBlock);
  const avgBlockTime = 600; // ~10 minutes

  return {
    blocks: blocksRemaining,
    estimatedSeconds: blocksRemaining * avgBlockTime,
    isReady: blocksRemaining <= 0,
  };
}

// Calculate total portfolio value
export function calculatePortfolioValue(
  stxBalance: number,
  agsBalance: number,
  stakedPositions: { amount: number }[]
): {
  available: number;
  staked: number;
  total: number;
} {
  const staked = stakedPositions.reduce((sum, pos) => sum + pos.amount, 0);
  
  return {
    available: stxBalance,
    staked,
    total: stxBalance + staked,
  };
}

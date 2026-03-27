import { TIERS, BLOCKS_PER_YEAR } from './constants';
import { aegisSdk, normalizeCvValue, asBigInt, asBoolean, asNumber } from './sdk';

export interface StakerInfo {
  amountStaked: bigint;
  stakeStartBlock: number;
  lastRewardBlock: number;
  pendingRewards: bigint;
  tier: number;
  activeStakeIds: bigint[];
}

/**
 * Global protocol statistics across all stakers
 */
export interface PoolStats {
  totalStaked: bigint;
  totalStakers: number;
  rewardRate: bigint;
  lastDistributionBlock: number;
}

interface UserStakePosition {
  stakeId: bigint;
  amount: bigint;
  startBlock: number;
  lockBlocks: number;
  lockPeriodType: number;
  bonusMultiplier: number;
  isActive: boolean;
  totalClaimed: bigint;
  pendingRewards: bigint;
}

function normalizeStakeId(rawId: unknown): bigint | null {
  const normalized = normalizeCvValue(rawId);
  if (typeof normalized === 'bigint') return normalized;
  if (typeof normalized === 'number' && Number.isFinite(normalized)) {
    return BigInt(Math.trunc(normalized));
  }
  if (typeof normalized === 'string' && normalized.trim() !== '') {
    try {
      return BigInt(normalized);
    } catch {
      return null;
    }
  }
  return null;
}

function parseStakePosition(
  stakeId: bigint,
  rawStake: unknown,
  pendingRewards: bigint
): UserStakePosition | null {
  if (!rawStake) return null;

  const normalized = normalizeCvValue(rawStake) as Record<string, unknown>;
  if (!normalized || typeof normalized !== 'object') return null;

  return {
    stakeId,
    amount: asBigInt(normalized['amount']),
    startBlock: asNumber(normalized['start-block']),
    lockBlocks: asNumber(normalized['lock-blocks']),
    lockPeriodType: asNumber(normalized['lock-period-type']),
    bonusMultiplier: asNumber(normalized['bonus-multiplier']),
    isActive: asBoolean(normalized['is-active']),
    totalClaimed: asBigInt(normalized['total-claimed']),
    pendingRewards,
  };
}

export async function getUserStakePositions(address: string): Promise<UserStakePosition[]> {
  const rawStakeIds = (await aegisSdk.getUserStakeIds(address)) as unknown[];
  const stakeIds = rawStakeIds
    .map((id: unknown) => normalizeStakeId(id))
    .filter((id): id is bigint => id !== null);

  if (stakeIds.length === 0) return [];

  const positions = await Promise.all(
    stakeIds.map(async (stakeId: bigint) => {
      const [stakeData, pendingRewards] = await Promise.all([
        aegisSdk.getStake(address, stakeId),
        aegisSdk.getPendingRewards(address, stakeId),
      ]);

      return parseStakePosition(stakeId, stakeData, asBigInt(normalizeCvValue(pendingRewards)));
    })
  );

  return positions.filter((position): position is UserStakePosition => position !== null);
}

export async function getBestClaimStakeId(address: string): Promise<bigint | null> {
  const positions = await getUserStakePositions(address);
  const activePositions = positions.filter((position) => position.isActive);
  if (activePositions.length === 0) return null;

  activePositions.sort((a, b) => {
    if (a.pendingRewards === b.pendingRewards) {
      if (a.stakeId === b.stakeId) return 0;
      return b.stakeId > a.stakeId ? 1 : -1;
    }
    return a.pendingRewards > b.pendingRewards ? -1 : 1;
  });

  return activePositions[0].stakeId;
}

export async function getStakeIdForExactAmount(
  address: string,
  requestedAmountMicroStx: bigint
): Promise<bigint | null> {
  const positions = await getUserStakePositions(address);
  const exactMatch = positions.find(
    (position) => position.isActive && position.amount === requestedAmountMicroStx
  );
  return exactMatch?.stakeId ?? null;
}

/**
 * Get staker information from the contract
 * @param address Stacks address to query
 * @returns Staker data or null if not found/error
 */
export async function getStakerInfo(address: string): Promise<StakerInfo | null> {
  try {
    const positions = await getUserStakePositions(address);
    const activePositions = positions.filter((position) => position.isActive);

    if (activePositions.length === 0) return null;

    const amountStaked = activePositions.reduce(
      (sum, position) => sum + position.amount,
      BigInt(0)
    );
    const pendingRewards = activePositions.reduce(
      (sum, position) => sum + position.pendingRewards,
      BigInt(0)
    );
    const stakeStartBlock = Math.min(...activePositions.map((position) => position.startBlock));
    const lastRewardBlock = Math.max(...activePositions.map((position) => position.startBlock));

    return {
      amountStaked,
      stakeStartBlock,
      lastRewardBlock,
      pendingRewards,
      tier: determineTier(amountStaked),
      activeStakeIds: activePositions.map((position) => position.stakeId),
    };
  } catch (error) {
    console.error(`Failed to get staker info for ${address}:`, error);
    return null;
  }
}

/**
 * Get pool statistics
 */
export async function getPoolStats(): Promise<PoolStats | null> {
  try {
    const [vaultStatsRaw, rewardsStatsRaw] = await Promise.all([
      aegisSdk.getStakingVaultStats(),
      aegisSdk.getRewardsStats(),
    ]);

    const vaultStats = normalizeCvValue(vaultStatsRaw) as Record<string, unknown>;
    const rewardsStats = normalizeCvValue(rewardsStatsRaw) as Record<string, unknown>;

    // Aegis v2.15 split contracts do not expose a simple per-block global reward rate.
    // We surface a stable baseline (5 AGS/day) for UI compatibility.
    const baselineRewardRatePerBlock = BigInt(5_000_000) / BigInt(144);

    return {
      totalStaked: asBigInt(vaultStats['total-staked']),
      totalStakers: asNumber(vaultStats['total-stakers']),
      rewardRate: baselineRewardRatePerBlock,
      lastDistributionBlock: asNumber(rewardsStats['merkle-update-block']),
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
  const tierMultiplier = TIERS[tier]?.multiplier ?? 1;
  return baseAPY * tierMultiplier;
}

/**
 * Calculate estimated rewards for a period
 * @param stakeAmount Amount of STX staked (microSTX)
 * @param apy Current APY percentage (e.g., 12.5)
 * @param blocks Number of blocks to calculate rewards for
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

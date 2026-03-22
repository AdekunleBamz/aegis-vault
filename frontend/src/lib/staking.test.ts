import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateAPY, calculateEstimatedRewards, determineTier } from './staking';
import { MICRO_STX_DENOMINATOR, TIERS } from './constants';

describe('staking', () => {
  describe('calculateAPY', () => {
    it('should return base APY for tier 0', () => {
      const apy = calculateAPY(BigInt(1000), 0);
      expect(apy).toBe(TIERS[0].baseApy);
    });

    it('should apply multiplier for higher tiers', () => {
      const apy = calculateAPY(BigInt(100000), 3);
      expect(apy).toBe(TIERS[0].baseApy * TIERS[3].multiplier);
    });
  });

  describe('calculateEstimatedRewards', () => {
    it('should calculate rewards correctly', () => {
      const amount = BigInt(1000 * MICRO_STX_DENOMINATOR); // 1000 STX
      const apy = 10; // 10%
      const blocks = 144; // 1 day
      // 1000 * 0.1 = 100 STX per year
      // 100 * 144 / 52560 = 0.27375 STX
      const expected = BigInt(Math.floor((1000 * MICRO_STX_DENOMINATOR * 0.1 * 144) / 52560));
      const rewards = calculateEstimatedRewards(amount, apy, blocks);
      expect(rewards).toBe(expected);
    });
  });

  describe('determineTier', () => {
    it('should return 0 for minimal stake', () => {
      expect(determineTier(BigInt(10 * MICRO_STX_DENOMINATOR))).toBe(0);
    });

    it('should return 3 for platinum stake', () => {
      expect(determineTier(BigInt(1000000 * MICRO_STX_DENOMINATOR))).toBe(3);
    });
  });
});

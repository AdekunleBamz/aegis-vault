import { describe, it, expect } from 'vitest';
import { createMockStakerInfo } from './test-utils';

describe('test-utils', () => {
  describe('createMockStakerInfo', () => {
    it('should create info with default values', () => {
      const info = createMockStakerInfo();
      expect(info.amountStaked).toBe(BigInt(1000000));
      expect(info.tier).toBe(0);
    });

    it('should allow overriding values', () => {
      const info = createMockStakerInfo({ tier: 2, amountStaked: BigInt(5000) });
      expect(info.tier).toBe(2);
      expect(info.amountStaked).toBe(BigInt(5000));
    });
  });
});

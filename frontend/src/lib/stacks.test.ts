import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeStake } from './stacks';
import * as connect from '@stacks/connect';

// Mock @stacks/connect
vi.mock('@stacks/connect', () => ({
  openContractCall: vi.fn(),
  STACKS_MAINNET: { url: 'https://api.mainnet.hiro.so' },
}));

// Mock @stacks/transactions
vi.mock('@stacks/transactions', () => ({
  uintCV: vi.fn(v => ({ type: 'uint', value: v })),
  principalCV: vi.fn(v => ({ type: 'principal', value: v })),
  makeStandardSTXPostCondition: vi.fn(() => ({ type: 'post-condition' })),
  FungibleConditionCode: { Equal: 1 },
  PostConditionMode: { Deny: 1, Allow: 2 },
}));

describe('stacks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeStake', () => {
    it('should call openContractCall with correct parameters', async () => {
      const amount = BigInt(1000000);
      const sender = 'SP123';
      
      // We don't await here as it returns a promise that resolves onFinish
      const promise = executeStake(amount, sender);
      
      expect(connect.openContractCall).toHaveBeenCalledWith(expect.objectContaining({
        functionName: 'stake',
        functionArgs: [expect.objectContaining({ value: amount })],
      }));

      // Simulate onFinish
      const options = (connect.openContractCall as any).mock.calls[0][0];
      options.onFinish({ txId: '0x123' });

      const result = await promise;
      expect(result).toEqual({ txId: '0x123', success: true });
    });

    it('should reject on cancellation', async () => {
      const promise = executeStake(BigInt(1000), 'SP123');
      
      const options = (connect.openContractCall as any).mock.calls[0][0];
      options.onCancel();

      await expect(promise).rejects.toThrow('Transaction cancelled');
    });
  });
});

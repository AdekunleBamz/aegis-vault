import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getAccountBalance, 
  getAccountTransactions, 
  callReadOnlyFunction, 
  getCurrentBlockHeight 
} from './api';
import { API } from './constants';

describe('api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('getAccountBalance', () => {
    it('should fetch balance correctly', async () => {
      const mockData = { stx: { balance: '1000' }, fungible_tokens: {} };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await getAccountBalance('SP123');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(`${API.STACKS_API}/v2/accounts/SP123`, expect.any(Object));
    });

    it('should throw on error response', async () => {
      (fetch as any).mockResolvedValue({ ok: false });
      await expect(getAccountBalance('SP123')).rejects.toThrow();
    });
  });

  describe('callReadOnlyFunction', () => {
    it('should call read-only function correctly', async () => {
      const mockResult = { okay: true, result: '0x01' };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });

      const result = await callReadOnlyFunction('ADDR', 'NAME', 'FUNC', ['arg1']);
      expect(result).toEqual(mockResult);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v2/contracts/call-read/ADDR/NAME/FUNC'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('getCurrentBlockHeight', () => {
    it('should fetch block height correctly', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ stacks_tip_height: 123 }),
      });

      const height = await getCurrentBlockHeight();
      expect(height).toBe(123);
    });
  });
});

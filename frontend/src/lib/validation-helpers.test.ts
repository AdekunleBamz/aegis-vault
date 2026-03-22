import { describe, it, expect } from 'vitest';
import { validateStakeAmount } from './validation-helpers';

describe('validation-helpers', () => {
  describe('validateStakeAmount', () => {
    it('should return null for valid amount within balance', () => {
      expect(validateStakeAmount('100', 100, 1000)).toBeNull();
    });

    it('should return error for amount <= 0', () => {
      expect(validateStakeAmount('0', 0, 1000)).toBe('Amount must be greater than 0');
      expect(validateStakeAmount('-1', -1, 1000)).toBe('Amount must be greater than 0');
    });

    it('should return error for amount > balance', () => {
      expect(validateStakeAmount('1100', 1100, 1000)).toBe('Insufficient STX balance');
    });

    it('should return error for amount < minimum', () => {
      // Assuming MIN_STAKE_STX is 0.01
      expect(validateStakeAmount('0.005', 0.005, 1000)).toBe('Minimum stake is 0.01 STX');
    });

    it('should return null for empty string (not yet entered)', () => {
      expect(validateStakeAmount('', 0, 1000)).toBeNull();
    });
  });
});

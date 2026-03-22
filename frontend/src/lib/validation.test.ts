import { describe, it, expect } from 'vitest';
import { 
  stacksAddressSchema, 
  stxAmountSchema, 
  isValidStacksAddress,
  stxToMicroStx,
  microStxToStx,
  stakeFormSchema
} from './validation';

describe('validation', () => {
  describe('stacksAddressSchema', () => {
    it('should validate correct Stacks addresses', () => {
      expect(stacksAddressSchema.safeParse('SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9').success).toBe(true);
      expect(stacksAddressSchema.safeParse('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM').success).toBe(true);
    });

    it('should fail on invalid addresses', () => {
      expect(stacksAddressSchema.safeParse('invalid-address').success).toBe(false);
      expect(stacksAddressSchema.safeParse('SP123').success).toBe(false);
    });
  });

  describe('stxAmountSchema', () => {
    it('should validate correct STX amounts', () => {
      expect(stxAmountSchema.safeParse('100').success).toBe(true);
      expect(stxAmountSchema.safeParse('0.5').success).toBe(true);
      expect(stxAmountSchema.safeParse('123.456789').success).toBe(true);
    });

    it('should fail on invalid STX amounts', () => {
      expect(stxAmountSchema.safeParse('abc').success).toBe(false);
      expect(stxAmountSchema.safeParse('1.2.3').success).toBe(false);
      expect(stxAmountSchema.safeParse('123.4567890').success).toBe(false); // Too many decimals
    });
  });

  describe('isValidStacksAddress', () => {
    it('should return true for valid address', () => {
      expect(isValidStacksAddress('SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9')).toBe(true);
    });

    it('should return false for invalid address', () => {
      expect(isValidStacksAddress('not-an-address')).toBe(false);
    });
  });

  describe('stxToMicroStx', () => {
    it('should convert STX to uSTX', () => {
      expect(stxToMicroStx(1)).toBe(1_000_000);
      expect(stxToMicroStx('0.5')).toBe(500_000);
    });

    it('should throw on invalid input', () => {
      expect(() => stxToMicroStx('abc')).toThrow();
      expect(() => stxToMicroStx(-1)).toThrow();
    });
  });

  describe('stakeFormSchema', () => {
    it('should validate correct form data', () => {
      const data = {
        amount: '100',
        lockPeriod: 30,
        termsAccepted: true
      };
      expect(stakeFormSchema.safeParse(data).success).toBe(true);
    });

    it('should fail on invalid form data', () => {
      const data = {
        amount: '0',
        lockPeriod: 5,
        termsAccepted: false
      };
      const result = stakeFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});

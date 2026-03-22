import { describe, it, expect } from 'vitest';
import { 
  formatSTX, 
  formatAGS, 
  toMicroSTX, 
  truncateAddress, 
  formatPercent, 
  formatBlockHeight,
  blocksToTime,
  formatRelativeTime
} from './format';

describe('format', () => {
  describe('formatSTX', () => {
    it('should format uSTX to STX string', () => {
      expect(formatSTX(1000000).replace(/\u00a0/g, ' ')).toBe('1.00');
      expect(formatSTX('5000000').replace(/\u00a0/g, ' ')).toBe('5.00');
      expect(formatSTX(0n).replace(/\u00a0/g, ' ')).toBe('0.00');
    });
  });

  describe('formatAGS', () => {
    it('should format uAGS to AGS string', () => {
      expect(formatAGS(100000000).replace(/\u00a0/g, ' ')).toBe('1.00');
      expect(formatAGS('500000000').replace(/\u00a0/g, ' ')).toBe('5.00');
    });
  });

  describe('toMicroSTX', () => {
    it('should convert STX to uSTX bigint', () => {
      expect(toMicroSTX(1.5)).toBe(1500000n);
      expect(toMicroSTX(0)).toBe(0n);
    });
  });

  describe('truncateAddress', () => {
    it('should truncate address correctly', () => {
      const addr = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
      expect(truncateAddress(addr)).toBe('SP2PAB...2JG9');
      expect(truncateAddress(addr, 2)).toBe('SP2P...G9');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage', () => {
      expect(formatPercent(12.3456)).toBe('12.35%');
      expect(formatPercent(0)).toBe('0.00%');
    });
  });

  describe('formatBlockHeight', () => {
    it('should format block height with commas', () => {
      expect(formatBlockHeight(123456)).toBe('123,456');
    });
  });

  describe('blocksToTime', () => {
    it('should estimate time from blocks', () => {
      expect(blocksToTime(3)).toBe('30 min');
      expect(blocksToTime(12)).toBe('2 hrs');
      expect(blocksToTime(144)).toBe('1 day');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return relative time strings', () => {
      const now = Date.now() / 1000;
      expect(formatRelativeTime(now - 30)).toBe('Just now');
      expect(formatRelativeTime(now - 120)).toBe('2m ago');
      expect(formatRelativeTime(now - 7200)).toBe('2h ago');
    });
  });
});

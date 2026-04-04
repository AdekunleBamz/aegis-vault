import { describe, expect, it } from 'vitest';

import {
  blocksToTime,
  formatAGS,
  formatBlockHeight,
  formatPercent,
  formatSTX,
  safeFormatAGS,
  truncateAddress,
} from '../format';

describe('formatSTX', () => {
  it('formats whole STX amounts with two decimal places', () => {
    expect(formatSTX(1_000_000)).toBe('1.00');
    expect(formatSTX('25_000_000'.replace(/_/g, ''))).toBe('25.00');
  });

  it('keeps up to six fractional digits for microSTX values', () => {
    expect(formatSTX(1_234_567)).toBe('1.234567');
    expect(formatSTX(2_500_000)).toBe('2.50');
  });

  it('preserves bigint precision for large STX balances', () => {
    expect(formatSTX(123_456_789_123_456_789n)).toBe('123,456,789,123.456789');
  });
});

describe('formatAGS', () => {
  it('formats whole AGS amounts with two decimal places', () => {
    expect(formatAGS(1_000_000)).toBe('1.00');
    expect(formatAGS(7_500_000)).toBe('7.50');
  });

  it('preserves bigint precision for large AGS balances', () => {
    expect(formatAGS(987_654_321_123_456_789n)).toBe('987,654,321,123.456789');
  });
});

describe('safeFormatAGS', () => {
  it('falls back to zero for missing or invalid values', () => {
    expect(safeFormatAGS(null)).toBe('0.00');
    expect(safeFormatAGS(undefined)).toBe('0.00');
    expect(safeFormatAGS('invalid')).toBe('0.00');
  });
});

describe('truncateAddress', () => {
  it('shortens Stacks addresses with a middle ellipsis', () => {
    expect(truncateAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toBe('SP3FKN...GG6N');
  });
});

describe('numeric display helpers', () => {
  it('formats percentages and block heights for dashboards', () => {
    expect(formatPercent(12.3456)).toBe('12.35%');
    expect(formatBlockHeight(1234567)).toBe('1,234,567');
  });
});

describe('blocksToTime', () => {
  it('converts block counts into minutes, hours, and days', () => {
    expect(blocksToTime(3)).toBe('30 min');
    expect(blocksToTime(12)).toBe('2 hrs');
    expect(blocksToTime(144)).toBe('1 day');
  });
});

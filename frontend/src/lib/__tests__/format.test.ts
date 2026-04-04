import { describe, expect, it } from 'vitest';

import { formatAGS, formatSTX } from '../format';

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
});

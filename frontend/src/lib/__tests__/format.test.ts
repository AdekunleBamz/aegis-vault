import { describe, expect, it } from 'vitest';

import { formatSTX } from '../format';

describe('formatSTX', () => {
  it('formats whole STX amounts with two decimal places', () => {
    expect(formatSTX(1_000_000)).toBe('1.00');
    expect(formatSTX('25_000_000'.replace(/_/g, ''))).toBe('25.00');
  });
});

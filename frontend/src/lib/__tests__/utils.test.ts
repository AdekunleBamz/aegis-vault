import { describe, expect, it } from 'vitest';

import { splitContractId } from '../utils';

describe('splitContractId', () => {
  it('returns the address and contract name from a fully qualified id', () => {
    expect(splitContractId('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15')).toEqual([
      'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
      'aegis-staking-v2-15',
    ]);
  });
});

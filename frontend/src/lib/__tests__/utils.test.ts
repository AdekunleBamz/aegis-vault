import { describe, expect, it } from 'vitest';

import { isMainnetAddress, splitContractId } from '../utils';

describe('splitContractId', () => {
  it('returns the address and contract name from a fully qualified id', () => {
    expect(splitContractId('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15')).toEqual([
      'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
      'aegis-staking-v2-15',
    ]);
  });

  it('rejects malformed contract ids', () => {
    expect(() => splitContractId('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toThrow('Invalid contract ID');
  });
});

describe('isMainnetAddress', () => {
  it('recognizes both standard and multisig mainnet prefixes', () => {
    expect(isMainnetAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toBe(true);
    expect(isMainnetAddress('SM3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toBe(true);
    expect(isMainnetAddress('ST3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toBe(false);
  });
});

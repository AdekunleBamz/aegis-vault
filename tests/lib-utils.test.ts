import { describe, expect, it } from 'vitest'
import {
  clamp,
  cn,
  isDevnetAddress,
  isMainnetAddress,
  isStacksAddress,
  isTestnetAddress,
  isValidAmount,
  isValidContractId,
  pluralize,
  splitContractId,
  toTitleCase,
  truncateAddress,
} from '../frontend/src/lib/utils'

describe('lib utils', () => {
  it('merges conflicting Tailwind utility classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('accepts trimmed contract identifiers', () => {
    expect(isValidContractId(' SP123.contract-name ')).toBe(true)
  })

  it('splits trimmed contract identifiers into address and name', () => {
    expect(splitContractId(' SP123.contract-name ')).toEqual(['SP123', 'contract-name'])
  })

  it('keeps dotted contract name suffixes together', () => {
    expect(splitContractId('SP123.vault.v3')).toEqual(['SP123', 'vault.v3'])
  })

  it('rejects abbreviated mainnet prefixes that are not full addresses', () => {
    expect(isMainnetAddress('SP')).toBe(false)
  })

  it('rejects abbreviated testnet prefixes that are not full addresses', () => {
    expect(isTestnetAddress('ST')).toBe(false)
  })

  it('rejects abbreviated devnet prefixes that are not full addresses', () => {
    expect(isDevnetAddress('SN')).toBe(false)
  })

  it('accepts mainnet addresses through the combined address helper', () => {
    expect(isStacksAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toBe(true)
  })

  it('accepts testnet addresses through the combined address helper', () => {
    expect(isStacksAddress('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5')).toBe(true)
  })

  it('accepts devnet addresses through the combined address helper', () => {
    expect(isStacksAddress(`SN${'A'.repeat(39)}`)).toBe(true)
  })

  it('accepts positive numeric string amounts', () => {
    expect(isValidAmount('12.5')).toBe(true)
  })

  it('rejects zero-value amounts', () => {
    expect(isValidAmount(0)).toBe(false)
  })

  it('clamps values below the lower bound', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps values above the upper bound', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('uses the lower bound for non-finite clamp values', () => {
    expect(clamp(Number.NaN, 2, 10)).toBe(2)
  })

  it('formats singular pluralized labels', () => {
    expect(pluralize(1, 'position')).toBe('1 position')
  })

  it('formats custom plural labels', () => {
    expect(pluralize(2, 'entry', 'entries')).toBe('2 entries')
  })

  it('formats camel case labels as title case', () => {
    expect(toTitleCase('stakingReward')).toBe('Staking Reward')
  })

  it('returns empty title case labels for non-string values', () => {
    expect(toTitleCase(12 as unknown as string)).toBe('')
  })

  it('trims utility addresses before truncating them', () => {
    expect(truncateAddress('  SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N  ')).toBe('SP3FKN…GG6N')
  })
})

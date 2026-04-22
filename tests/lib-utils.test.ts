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
})

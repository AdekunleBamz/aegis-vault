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
})

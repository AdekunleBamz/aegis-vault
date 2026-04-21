import { describe, expect, it } from 'vitest'
import { isMainnetAddress, isTestnetAddress, isValidContractId, splitContractId } from '../frontend/src/lib/utils'

describe('lib utils', () => {
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
})

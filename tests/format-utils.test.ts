import { describe, expect, it } from 'vitest'
import { toMicroSTX, truncateAddress } from '../frontend/src/lib/format'

describe('format utils', () => {
  it('trims surrounding spaces before truncating addresses', () => {
    expect(truncateAddress('  SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N  ')).toBe('SP3F...GG6N')
  })

  it('returns zero microSTX for non-finite STX inputs', () => {
    expect(toMicroSTX(Number.NaN)).toBe(0n)
    expect(toMicroSTX(Number.POSITIVE_INFINITY)).toBe(0n)
  })
})

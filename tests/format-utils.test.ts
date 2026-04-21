import { describe, expect, it } from 'vitest'
import { formatCompactSTX, toMicroAGS, toMicroSTX, truncateAddress } from '../frontend/src/lib/format'

describe('format utils', () => {
  it('trims surrounding spaces before truncating addresses', () => {
    expect(truncateAddress('  SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N  ')).toBe('SP3F...GG6N')
  })

  it('returns zero microSTX for non-finite STX inputs', () => {
    expect(toMicroSTX(Number.NaN)).toBe(0n)
    expect(toMicroSTX(Number.POSITIVE_INFINITY)).toBe(0n)
  })

  it('returns zero microAGS for invalid AGS inputs', () => {
    expect(toMicroAGS(Number.NaN)).toBe(0n)
    expect(toMicroAGS(-1)).toBe(0n)
  })

  it('falls back to 0.00 for malformed compact STX inputs', () => {
    expect(formatCompactSTX('1.2')).toBe('0.00')
  })
})

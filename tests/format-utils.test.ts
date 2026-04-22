import { describe, expect, it } from 'vitest'
import {
  blocksToTime,
  formatAGS,
  formatAGSRaw,
  formatAPY,
  formatBlockHeight,
  formatBlocksAsDays,
  formatCompactSTX,
  formatDuration,
  formatPercent,
  formatPercentage,
  formatRelativeTime,
  formatSTX,
  formatSTXRaw,
  safeFormatAGS,
  safeFormatSTX,
  toMicroAGS,
  toMicroSTX,
  truncateAddress,
} from '../frontend/src/lib/format'

describe('format utils', () => {
  it('formats microSTX with fixed decimals', () => {
    expect(formatSTX(1_000_000n)).toBe('1.00')
  })

  it('trims surrounding spaces before truncating addresses', () => {
    expect(truncateAddress('  SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N  ')).toBe('SP3FKN...GG6N')
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

  it('falls back to 0 for malformed raw STX inputs', () => {
    expect(formatSTXRaw('1.2')).toBe('0')
  })

  it('falls back to 0 for malformed raw AGS inputs', () => {
    expect(formatAGSRaw('1.2')).toBe('0')
  })

  it('floors fractional block counts before converting to time', () => {
    expect(blocksToTime(1.9)).toBe('10 min')
  })

  it('floors decimal block heights before formatting', () => {
    expect(formatBlockHeight(1234.9)).toBe('1,234')
  })

  it('returns Just now for invalid relative-time inputs', () => {
    expect(formatRelativeTime(Number.NaN)).toBe('Just now')
  })
})

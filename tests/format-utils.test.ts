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

  it('formats fractional STX values up to six decimals', () => {
    expect(formatSTX(1_234_567n)).toBe('1.234567')
  })

  it('formats microAGS with fixed decimals', () => {
    expect(formatAGS(1_000_000n)).toBe('1.00')
  })

  it('formats fractional AGS values up to six decimals', () => {
    expect(formatAGS(2_500_001n)).toBe('2.500001')
  })

  it('safely formats null STX values', () => {
    expect(safeFormatSTX(null)).toBe('0.00')
  })

  it('safely formats malformed STX values', () => {
    expect(safeFormatSTX('1.5')).toBe('0.00')
  })

  it('safely formats undefined AGS values', () => {
    expect(safeFormatAGS(undefined)).toBe('0.00')
  })

  it('safely formats malformed AGS values', () => {
    expect(safeFormatAGS('2.5')).toBe('0.00')
  })

  it('trims surrounding spaces before truncating addresses', () => {
    expect(truncateAddress('  SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N  ')).toBe('SP3FKN...GG6N')
  })

  it('returns an empty address label for non-string addresses', () => {
    expect(truncateAddress(123 as unknown as string)).toBe('')
  })

  it('leaves short addresses untruncated', () => {
    expect(truncateAddress('SP123', 4)).toBe('SP123')
  })

  it('returns zero microSTX for non-finite STX inputs', () => {
    expect(toMicroSTX(Number.NaN)).toBe(0n)
    expect(toMicroSTX(Number.POSITIVE_INFINITY)).toBe(0n)
  })

  it('converts decimal STX amounts to microSTX', () => {
    expect(toMicroSTX(1.25)).toBe(1_250_000n)
  })

  it('returns zero microSTX for negative STX inputs', () => {
    expect(toMicroSTX(-1)).toBe(0n)
  })

  it('returns zero microAGS for invalid AGS inputs', () => {
    expect(toMicroAGS(Number.NaN)).toBe(0n)
    expect(toMicroAGS(-1)).toBe(0n)
  })

  it('converts decimal AGS amounts to microAGS', () => {
    expect(toMicroAGS(2.75)).toBe(2_750_000n)
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

  it('formats percentage values with two decimals', () => {
    expect(formatPercent(12.345)).toBe('12.35%')
  })

  it('falls back for non-finite percentage values', () => {
    expect(formatPercent(Number.POSITIVE_INFINITY)).toBe('0.00%')
  })

  it('floors fractional block counts before converting to time', () => {
    expect(blocksToTime(1.9)).toBe('10 min')
  })

  it('formats block counts that span hours', () => {
    expect(blocksToTime(12)).toBe('2 hrs')
  })

  it('formats day-long block durations', () => {
    expect(blocksToTime(144)).toBe('1 day')
  })

  it('formats zero block durations as zero minutes', () => {
    expect(blocksToTime(0)).toBe('0 min')
  })

  it('floors decimal block heights before formatting', () => {
    expect(formatBlockHeight(1234.9)).toBe('1,234')
  })

  it('formats large block heights with separators', () => {
    expect(formatBlockHeight(1234567)).toBe('1,234,567')
  })

  it('returns Just now for invalid relative-time inputs', () => {
    expect(formatRelativeTime(Number.NaN)).toBe('Just now')
  })

  it('formats recent minute-relative timestamps', () => {
    expect(formatRelativeTime(Date.now() / 1000 - 120)).toBe('2m ago')
  })

  it('formats hour-relative timestamps', () => {
    expect(formatRelativeTime(Date.now() / 1000 - 7200)).toBe('2h ago')
  })
})

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

  it('formats compact STX below one token', () => {
    expect(formatCompactSTX(500_000n)).toBe('0.50')
  })

  it('formats thousand-scale compact STX values', () => {
    expect(formatCompactSTX(1_234_000_000n)).toBe('1.23K')
  })

  it('formats million-scale compact STX values', () => {
    expect(formatCompactSTX(2_500_000_000_000n)).toBe('2.50M')
  })

  it('falls back to 0 for malformed raw STX inputs', () => {
    expect(formatSTXRaw('1.2')).toBe('0')
  })

  it('formats raw STX without trailing zeros', () => {
    expect(formatSTXRaw(1_500_000n)).toBe('1.5')
  })

  it('formats zero raw STX as zero', () => {
    expect(formatSTXRaw(0n)).toBe('0')
  })

  it('falls back to 0 for malformed raw AGS inputs', () => {
    expect(formatAGSRaw('1.2')).toBe('0')
  })

  it('formats raw AGS without trailing zeros', () => {
    expect(formatAGSRaw(2_500_000n)).toBe('2.5')
  })

  it('formats zero raw AGS as zero', () => {
    expect(formatAGSRaw(0n)).toBe('0')
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

  it('formats day-relative timestamps', () => {
    expect(formatRelativeTime(Date.now() / 1000 - 172800)).toBe('2d ago')
  })

  it('keeps future relative timestamps as just now', () => {
    expect(formatRelativeTime(Date.now() / 1000 + 120)).toBe('Just now')
  })

  it('formats sub-minute durations in seconds', () => {
    expect(formatDuration(45_000)).toBe('45s')
  })

  it('formats minute durations with remaining seconds', () => {
    expect(formatDuration(125_000)).toBe('2m 5s')
  })

  it('formats hour durations with remaining minutes', () => {
    expect(formatDuration(3_660_000)).toBe('1h 1m')
  })

  it('falls back for negative durations', () => {
    expect(formatDuration(-1)).toBe('0s')
  })

  it('formats zero blocks as zero days', () => {
    expect(formatBlocksAsDays(0)).toBe('0 days')
  })

  it('formats one day of blocks with singular copy', () => {
    expect(formatBlocksAsDays(144)).toBe('1 day')
  })

  it('formats multiple days of blocks with plural copy', () => {
    expect(formatBlocksAsDays(288)).toBe('2 days')
  })

  it('formats ratio percentages with default decimals', () => {
    expect(formatPercentage(0.1234)).toBe('12.34%')
  })

  it('formats ratio percentages with custom decimals', () => {
    expect(formatPercentage(0.1234, 1)).toBe('12.3%')
  })

  it('falls back for invalid ratio percentage decimals', () => {
    expect(formatPercentage(0.1234, -1)).toBe('12.34%')
  })

  it('formats APY values with a suffix', () => {
    expect(formatAPY(15.5)).toBe('15.50% APY')
  })

  it('formats APY values with custom decimals', () => {
    expect(formatAPY(15.567, 1)).toBe('15.6% APY')
  })

  it('falls back for negative APY values', () => {
    expect(formatAPY(-1)).toBe('0.00% APY')
  })

  it('falls back for invalid APY decimal settings', () => {
    expect(formatAPY(12.345, -1)).toBe('12.35% APY')
  })

  it('formats zero microSTX with fixed decimals', () => {
    expect(formatSTX(0n)).toBe('0.00')
  })

  it('formats string microSTX inputs', () => {
    expect(formatSTX('2500000')).toBe('2.50')
  })

  it('formats large STX values with separators', () => {
    expect(formatSTX(1_234_567_890_000n)).toBe('1,234,567.89')
  })

  it('formats zero microAGS with fixed decimals', () => {
    expect(formatAGS(0n)).toBe('0.00')
  })

  it('formats string microAGS inputs', () => {
    expect(formatAGS('3500000')).toBe('3.50')
  })

  it('safely formats undefined STX values', () => {
    expect(safeFormatSTX(undefined)).toBe('0.00')
  })

  it('safely formats null AGS values', () => {
    expect(safeFormatAGS(null)).toBe('0.00')
  })

  it('uses default address truncation length for invalid char counts', () => {
    expect(truncateAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N', 1.5)).toBe('SP3FKN...GG6N')
  })

  it('returns an empty address label for blank addresses', () => {
    expect(truncateAddress('   ')).toBe('')
  })

  it('uses default address truncation length for negative char counts', () => {
    expect(truncateAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N', -1)).toBe('SP3FKN...GG6N')
  })

  it('floors extra STX precision when converting to microSTX', () => {
    expect(toMicroSTX(1.2345678)).toBe(1_234_567n)
  })

  it('returns zero microAGS for zero AGS input', () => {
    expect(toMicroAGS(0)).toBe(0n)
  })

  it('floors extra AGS precision when converting to microAGS', () => {
    expect(toMicroAGS(1.2345678)).toBe(1_234_567n)
  })

  it('formats compact STX at the million-token boundary', () => {
    expect(formatCompactSTX(1_000_000_000_000n)).toBe('1.00M')
  })

  it('formats compact STX at the thousand-token boundary', () => {
    expect(formatCompactSTX(1_000_000_000n)).toBe('1.00K')
  })

  it('formats zero compact STX values with decimals', () => {
    expect(formatCompactSTX(0n)).toBe('0.00')
  })

  it('formats raw STX from string microSTX inputs', () => {
    expect(formatSTXRaw('2500000')).toBe('2.5')
  })

  it('formats raw STX at one microSTX precision', () => {
    expect(formatSTXRaw(1n)).toBe('0.000001')
  })

  it('formats raw AGS from string microAGS inputs', () => {
    expect(formatAGSRaw('3000000')).toBe('3')
  })

  it('formats raw AGS at one microAGS precision', () => {
    expect(formatAGSRaw(1n)).toBe('0.000001')
  })

  it('formats negative percentage values explicitly', () => {
    expect(formatPercent(-1)).toBe('-1.00%')
  })

  it('formats zero percentage values with fixed decimals', () => {
    expect(formatPercent(0)).toBe('0.00%')
  })

  it('formats negative block counts as zero minutes', () => {
    expect(blocksToTime(-1)).toBe('0 min')
  })

  it('formats a single block as ten minutes', () => {
    expect(blocksToTime(1)).toBe('10 min')
  })

  it('formats one-hour block durations with a singular label', () => {
    expect(blocksToTime(6)).toBe('1 hr')
  })

  it('formats non-finite block heights with zero fallback', () => {
    expect(formatBlockHeight(Number.NaN)).toBe('0')
  })

  it('formats zero relative-time timestamps as just now', () => {
    expect(formatRelativeTime(0)).toBe('Just now')
  })

  it('formats future hour-relative timestamps', () => {
    expect(formatRelativeTime(Date.now() / 1000 + 3700)).toBe('1h from now')
  })

  it('formats zero millisecond durations as zero seconds', () => {
    expect(formatDuration(0)).toBe('0s')
  })

  it('formats non-finite durations as zero seconds', () => {
    expect(formatDuration(Number.NaN)).toBe('0s')
  })

  it('formats negative block day estimates with zero fallback', () => {
    expect(formatBlocksAsDays(-1)).toBe('0 days')
  })

  it('rounds half-day block estimates up to one day', () => {
    expect(formatBlocksAsDays(72)).toBe('1 day')
  })

  it('formats invalid ratio percentages with zero fallback', () => {
    expect(formatPercentage(Number.NaN)).toBe('0.00%')
  })

  it('formats ratio percentages with zero decimals', () => {
    expect(formatPercentage(0.1234, 0)).toBe('12%')
  })
})

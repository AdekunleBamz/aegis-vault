import { describe, expect, it } from 'vitest'
import { truncateAddress } from '../frontend/src/lib/format'

describe('format utils', () => {
  it('trims surrounding spaces before truncating addresses', () => {
    expect(truncateAddress('  SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N  ')).toBe('SP3F...GG6N')
  })
})

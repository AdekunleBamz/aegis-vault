import { describe, expect, it } from 'vitest'
import {
  microStxToStx,
  stxToMicroStx,
  isValidStacksAddress,
  isValidTxId,
  isValidStxAmount,
} from '../frontend/src/lib/validation'

describe('validation utils', () => {
  it('converts STX and micro-STX values in both directions', () => {
    expect(stxToMicroStx('1.5')).toBe(1_500_000)
    expect(stxToMicroStx(0.000001)).toBe(1)
    expect(microStxToStx(2_500_000)).toBe(2.5)
  })

  it('rejects STX values with more than 6 decimal places', () => {
    expect(() => stxToMicroStx('0.0000001')).toThrow('STX amount cannot have more than 6 decimal places')
    expect(() => stxToMicroStx(1.0000007)).toThrow('STX amount cannot have more than 6 decimal places')
  })

  it('rejects malformed STX amount inputs', () => {
    expect(() => stxToMicroStx('1abc')).toThrow('Invalid STX amount')
    expect(() => stxToMicroStx('-1')).toThrow('Invalid STX amount')
    expect(() => stxToMicroStx('')).toThrow('Invalid STX amount')
  })

  it('trims valid STX amount strings before conversion', () => {
    expect(stxToMicroStx(' 2.5 ')).toBe(2_500_000)
  })

  it('converts zero STX to zero micro-STX', () => {
    expect(stxToMicroStx(0)).toBe(0)
  })

  it('rejects non-finite STX values', () => {
    expect(() => stxToMicroStx(Number.POSITIVE_INFINITY)).toThrow('Invalid STX amount')
  })

  it('rejects negative micro-STX to STX conversions', () => {
    expect(() => microStxToStx(-1)).toThrow()
  })

  it('validates stacks addresses and tx ids', () => {
    expect(isValidStacksAddress('SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT')).toBe(true)
    expect(isValidStacksAddress(' SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT ')).toBe(true)
    expect(isValidStacksAddress('SP5K2RHMSB')).toBe(false)
    expect(isValidTxId(`0x${'a'.repeat(64)}`)).toBe(true)
    expect(isValidTxId(` 0x${'a'.repeat(64)} `)).toBe(true)
    expect(isValidTxId('0x123')).toBe(false)
  })

  it('accepts uppercase hex transaction hashes', () => {
    expect(isValidTxId(`0x${'A'.repeat(64)}`)).toBe(true)
  })

  it('rejects transaction hashes with uppercase 0X prefix', () => {
    expect(isValidTxId(`0X${'a'.repeat(64)}`)).toBe(false)
  })

  it('rejects lowercase stacks addresses that do not match format', () => {
    expect(isValidStacksAddress('sp5k2rhmsbh4pap4pgx77mcvnk1zeed07cwx9tjt')).toBe(false)
  })

  it('accepts trimmed valid STX amount strings', () => {
    expect(isValidStxAmount(' 12.123456 ')).toBe(true)
  })

  it('rejects STX amount strings with more than 6 decimals', () => {
    expect(isValidStxAmount('1.1234567')).toBe(false)
  })

  it('rejects STX amount strings with non-numeric suffixes', () => {
    expect(isValidStxAmount('2.5stx')).toBe(false)
  })
})

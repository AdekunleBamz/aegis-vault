import { describe, expect, it } from 'vitest'
import {
  ValidationError,
  apiResponseSchema,
  blockHeightSchema,
  getFieldError,
  isNonEmptyString,
  isValidLockPeriod,
  microStxToStx,
  paginationSchema,
  positiveIntSchema,
  protocolStatsSchema,
  safeValidate,
  stakeRequestSchema,
  stxToMicroStx,
  transactionRecordSchema,
  transactionStatusSchema,
  unstakeRequestSchema,
  userStatsSchema,
  validate,
  isValidStacksAddress,
  isValidStakeAmountSTX,
  isValidTxId,
  isValidStxAmount,
} from '../frontend/src/lib/validation'

describe('validation utils', () => {
  it('validates stake request payloads', () => {
    expect(validate(stakeRequestSchema, { amount: '1.5', lockPeriod: 7 })).toEqual({
      amount: '1.5',
      lockPeriod: 7,
    })
  })

  it('returns safe validation errors without throwing', () => {
    const result = safeValidate(stakeRequestSchema, { amount: '1', lockPeriod: 0 })
    expect(result.success).toBe(false)
  })

  it('throws typed validation errors for invalid payloads', () => {
    expect(() => validate(stakeRequestSchema, { amount: '1', lockPeriod: 0 })).toThrow(ValidationError)
  })

  it('converts STX and micro-STX values in both directions', () => {
    expect(stxToMicroStx('1.5')).toBe(1_500_000)
    expect(stxToMicroStx(0.000001)).toBe(1)
    expect(microStxToStx(2_500_000)).toBe(2.5)
  })

  it('rejects STX values with more than 6 decimal places', () => {
    expect(() => stxToMicroStx('0.0000001')).toThrow('Invalid STX amount')
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
    expect(isValidStacksAddress('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5')).toBe(true)
    expect(isValidStacksAddress(' ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 ')).toBe(true)
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

  it('accepts whole-number STX amount strings', () => {
    expect(isValidStxAmount('25')).toBe(true)
  })

  it('rejects negative STX amount strings in validator helper', () => {
    expect(isValidStxAmount('-1')).toBe(false)
  })

  it('rejects tx ids that are missing the 0x prefix', () => {
    expect(isValidTxId('a'.repeat(64))).toBe(false)
  })

  it('rejects tx ids with non-hex characters', () => {
    expect(isValidTxId(`0x${'g'.repeat(64)}`)).toBe(false)
  })

  it('converts zero micro-STX to zero STX', () => {
    expect(microStxToStx(0)).toBe(0)
  })

  it('converts one micro-STX to minimal STX value', () => {
    expect(microStxToStx(1)).toBe(0.000001)
  })

  it('converts whole-number STX numeric input to micro-STX', () => {
    expect(stxToMicroStx(3)).toBe(3_000_000)
  })

  it('converts decimal STX numeric input to micro-STX', () => {
    expect(stxToMicroStx(0.25)).toBe(250_000)
  })

  it('rejects empty stacks address helper input', () => {
    expect(isValidStacksAddress('')).toBe(false)
  })

  it('rejects whitespace-only tx id helper input', () => {
    expect(isValidTxId('   ')).toBe(false)
  })

  it('rejects whitespace-only STX amount helper input', () => {
    expect(isValidStxAmount('   ')).toBe(false)
  })

  it('rejects scientific notation STX strings in conversion helper', () => {
    expect(() => stxToMicroStx('1e3')).toThrow('Invalid STX amount')
  })

  it('converts six-decimal minimum STX strings correctly', () => {
    expect(stxToMicroStx('0.000001')).toBe(1)
  })

  it('rejects tx ids that are longer than 64 hex characters', () => {
    expect(isValidTxId(`0x${'a'.repeat(65)}`)).toBe(false)
  })

  it('rejects unsupported stacks address prefixes', () => {
    expect(isValidStacksAddress('SM5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT')).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { isValidContractId } from '../frontend/src/lib/utils'

describe('lib utils', () => {
  it('accepts trimmed contract identifiers', () => {
    expect(isValidContractId(' SP123.contract-name ')).toBe(true)
  })
})

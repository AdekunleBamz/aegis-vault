/**
 * @file Validation utilities for Aegis Vault
 *
 * Provides Zod schemas and validation functions for API requests,
 * form data, and blockchain data validation.
 */

import { z } from 'zod'
import { MICROSTX_PER_STX } from './constants'

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Validates a Stacks address format.
 */
export const stacksAddressSchema = z.string().regex(
  /^(S[PM]|ST)[A-Z0-9]{39,40}$/,
  'Invalid Stacks address format'
)

/**
 * Validates a micro-STX amount (unsigned integer).
 */
export const microStxSchema = z.number().int().nonnegative()

/**
 * Validates an STX amount string format.
 */
export const stxAmountSchema = z.string().trim().regex(
  /^\d+(\.\d{1,6})?$/,
  'Invalid STX amount format'
)

/**
 * Validates a block height number.
 */
export const blockHeightSchema = z.number().int().positive()

/**
 * Validates a transaction ID format.
 */
export const txIdSchema = z.string().regex(
  /^0x[a-fA-F0-9]{64}$/,
  'Invalid transaction ID format'
)

// ============================================================================
// Staking Schemas
// ============================================================================

/**
 * Schema for validating a stake position.
 */
export const stakePositionSchema = z.object({
  staker: stacksAddressSchema,
  amount: microStxSchema,
  lockPeriod: z.number().int().min(1).max(365),
  startBlock: blockHeightSchema,
  endBlock: blockHeightSchema,
  tier: z.number().int().min(1).max(5),
  rewards: microStxSchema.optional(),
  status: z.enum(['active', 'unlocked', 'withdrawn']),
})

export type StakePosition = z.infer<typeof stakePositionSchema>

/**
 * Schema for validating a stake request.
 */
export const stakeRequestSchema = z.object({
  amount: stxAmountSchema,
  lockPeriod: z.number().int().min(1).max(365),
})

export type StakeRequest = z.infer<typeof stakeRequestSchema>

/**
 * Schema for validating an unstake request.
 */
export const unstakeRequestSchema = z.object({
  positionId: z.number().int().nonnegative(),
})

export type UnstakeRequest = z.infer<typeof unstakeRequestSchema>

// ============================================================================
// Rewards Schemas
// ============================================================================

/**
 * Schema for validating reward information.
 */
export const rewardInfoSchema = z.object({
  pendingRewards: microStxSchema,
  claimedRewards: microStxSchema,
  totalRewards: microStxSchema,
  lastClaimBlock: blockHeightSchema.optional(),
  apr: z.number().min(0).max(100),
})

export type RewardInfo = z.infer<typeof rewardInfoSchema>

/**
 * Schema for validating a claim request.
 */
export const claimRequestSchema = z.object({
  positionIds: z.array(z.number().int().nonnegative()).optional(),
})

export type ClaimRequest = z.infer<typeof claimRequestSchema>

// ============================================================================
// Transaction Schemas
// ============================================================================

/**
 * Schema for validating transaction status values.
 */
export const transactionStatusSchema = z.enum([
  'pending',
  'success',
  'failed',
  'aborted',
])

/**
 * Schema for validating a transaction record.
 */
export const transactionRecordSchema = z.object({
  txId: txIdSchema,
  type: z.enum(['stake', 'unstake', 'claim', 'transfer']),
  status: transactionStatusSchema,
  amount: microStxSchema.optional(),
  sender: stacksAddressSchema,
  recipient: stacksAddressSchema.optional(),
  blockHeight: blockHeightSchema.optional(),
  timestamp: z.number().int().positive().optional(),
  fee: microStxSchema.optional(),
})

export type TransactionRecord = z.infer<typeof transactionRecordSchema>

// ============================================================================
// Protocol Stats Schemas
// ============================================================================

/**
 * Schema for validating protocol statistics.
 */
export const protocolStatsSchema = z.object({
  totalStaked: microStxSchema,
  totalStakers: z.number().int().nonnegative(),
  totalRewardsDistributed: microStxSchema,
  currentAPR: z.number().min(0).max(100),
  tvl: microStxSchema,
  treasuryBalance: microStxSchema,
  activePositions: z.number().int().nonnegative(),
})

export type ProtocolStats = z.infer<typeof protocolStatsSchema>

// ============================================================================
// User Stats Schemas
// ============================================================================

/**
 * Schema for validating user statistics.
 */
export const userStatsSchema = z.object({
  address: stacksAddressSchema,
  stakedBalance: microStxSchema,
  availableBalance: microStxSchema,
  pendingRewards: microStxSchema,
  totalRewardsClaimed: microStxSchema,
  positionCount: z.number().int().nonnegative(),
  tier: z.number().int().min(0).max(5),
  stakingPower: z.number().min(0),
})

export type UserStats = z.infer<typeof userStatsSchema>

// ============================================================================
// API Response Schemas
// ============================================================================

/**
 * Generic API response wrapper schema factory.
 */
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }).optional(),
    timestamp: z.number().int().positive(),
  })

/**
 * Schema for validating pagination parameters.
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  total: z.number().int().nonnegative().optional(),
  hasMore: z.boolean().optional(),
})

export type Pagination = z.infer<typeof paginationSchema>

/**
 * Schema for validating lock period values (days).
 * Accepts only the three supported lock durations: 3, 7, or 30 days.
 */
export const lockPeriodDaysSchema = z.union([
  z.literal(3),
  z.literal(7),
  z.literal(30),
])

export type LockPeriodDays = z.infer<typeof lockPeriodDaysSchema>

/**
 * Schema for a positive integer (e.g. stake IDs, block counts).
 */
export const positiveIntSchema = z.number().int().positive()

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Custom error class for validation failures.
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: z.ZodIssue[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validates data against a schema, throwing on failure.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated and typed data
 * @throws ValidationError if validation fails
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const issues = result.error.issues
    const message = issues
      .map(i => `${i.path.join('.')}: ${i.message}`)
      .join('; ')
    throw new ValidationError(`Validation failed: ${message}`, issues)
  }

  return result.data
}

/**
 * Safe validation that returns a result instead of throwing.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Success with data or failure with ZodError
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, error: result.error }
}

/**
 * Checks if a string is a valid Stacks address.
 *
 * @param address - The address string to validate
 * @returns True if the address is valid
 */
export function isValidStacksAddress(address: string): boolean {
  const normalized = typeof address === 'string' ? address.trim() : ''
  return stacksAddressSchema.safeParse(normalized).success
}

/**
 * Checks if a string is a valid transaction ID.
 *
 * @param txId - The transaction ID string to validate
 * @returns True if the transaction ID is valid
 */
export function isValidTxId(txId: string): boolean {
  const normalized = typeof txId === 'string' ? txId.trim() : ''
  return txIdSchema.safeParse(normalized).success
}

/**
 * Checks if a string is a valid STX amount.
 *
 * @param amount - The amount string to validate
 * @returns True if the amount is valid
 */
export function isValidStxAmount(amount: string): boolean {
  const normalized = typeof amount === 'string' ? amount.trim() : ''
  return stxAmountSchema.safeParse(normalized).success
}

/**
 * Converts micro-STX to STX with validation.
 *
 * @param microStx - Amount in micro-STX
 * @returns Amount in STX
 */
export function microStxToStx(microStx: number): number {
  const validated = microStxSchema.parse(microStx)
  return validated / MICROSTX_PER_STX
}

/**
 * Converts STX to micro-STX with validation.
 *
 * @param stx - Amount in STX (number or string)
 * @returns Amount in micro-STX
 * @throws Error if the amount is invalid
 */
export function stxToMicroStx(stx: number | string): number {
  const normalizedInput = typeof stx === 'string' ? stx.trim() : stx

  if (typeof normalizedInput === 'string') {
    if (!/^\d+(\.\d{1,6})?$/.test(normalizedInput)) {
      throw new Error('Invalid STX amount')
    }
  }

  const amount = typeof normalizedInput === 'string'
    ? Number(normalizedInput)
    : normalizedInput

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Invalid STX amount')
  }

  if (Object.is(amount, -0)) {
    return 0
  }

  const microStx = amount * MICROSTX_PER_STX
  if (!Number.isFinite(microStx)) {
    throw new Error('Invalid STX amount')
  }

  if (Math.abs(microStx - Math.round(microStx)) > 0.000001) {
    throw new Error('STX amount cannot have more than 6 decimal places')
  }

  return Math.round(microStx)
}

// ============================================================================
// Form Validation Schemas
// ============================================================================

/**
 * Schema for validating stake form input.
 */
export const stakeFormSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(parseFloat(val)), 'Must be a valid number')
    .refine(val => parseFloat(val) > 0, 'Amount must be greater than 0')
    .refine(val => parseFloat(val) <= 1_000_000_000, 'Amount exceeds maximum'),
  lockPeriod: z.number()
    .int('Lock period must be a whole number')
    .min(7, 'Minimum lock period is 7 days')
    .max(365, 'Maximum lock period is 365 days'),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
})

export type StakeFormData = z.infer<typeof stakeFormSchema>

/**
 * Schema for validating withdraw form input.
 */
export const withdrawFormSchema = z.object({
  positionId: z.number().int().nonnegative('Invalid position'),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(parseFloat(val)), 'Must be a valid number')
    .refine(val => parseFloat(val) > 0, 'Amount must be greater than 0'),
})

export type WithdrawFormData = z.infer<typeof withdrawFormSchema>

const validation = {
  validate,
  safeValidate,
  isValidStacksAddress,
  isValidTxId,
  isValidStxAmount,
  microStxToStx,
  stxToMicroStx,
}

/**
 * Returns the first ZodIssue message for the given field path, or undefined.
 *
 * @param error - A ZodError instance
 * @param field - The field path to look up (e.g. "amount")
 * @returns The first error message for that field, or undefined
 */
export function getFieldError(error: import('zod').ZodError, field: string): string | undefined {
  return error.issues.find((issue) => issue.path.join('.') === field)?.message;
}

/**
 * Returns true if the lock period (in days) is within the allowed range [3, 30].
 *
 * @param days - The lock period to validate
 * @returns True if within bounds
 */
export function isValidLockPeriod(days: number): boolean {
  return Number.isInteger(days) && days >= 3 && days <= 30;
}

/**
 * Returns true if the STX amount (in whole STX) meets the minimum stake threshold.
 *
 * @param amount - The amount to check in whole STX (not microSTX)
 * @param minStx - Minimum valid amount in STX (default 0.01)
 * @returns True if the amount is a finite positive number at or above the minimum
 */
export function isValidStakeAmountSTX(amount: number, minStx = 0.01): boolean {
  return Number.isFinite(amount) && amount >= minStx;
}

/**
 * Returns true if the value is a non-empty string after trimming.
 *
 * @param value - The value to test
 * @returns True if `value` is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Returns true if the value is a safe positive integer (e.g. position IDs, block counts).
 *
 * @param value - The value to check
 * @returns True if `value` is a safe positive integer
 */
export function isSafePositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

export default validation

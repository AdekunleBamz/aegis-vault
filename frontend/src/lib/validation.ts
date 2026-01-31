// API Validation Utilities for Aegis Vault
// Provides type-safe validation for API requests and responses

import { z } from 'zod'

// ============================================================================
// Base Schemas
// ============================================================================

// Stacks address validation
export const stacksAddressSchema = z.string().regex(
  /^(S[PM]|ST)[A-Z0-9]{39,40}$/,
  'Invalid Stacks address format'
)

// Micro-STX amount (unsigned integer)
export const microStxSchema = z.number().int().nonnegative()

// STX amount string
export const stxAmountSchema = z.string().regex(
  /^\d+(\.\d{1,6})?$/,
  'Invalid STX amount format'
)

// Block height
export const blockHeightSchema = z.number().int().positive()

// Transaction ID
export const txIdSchema = z.string().regex(
  /^0x[a-fA-F0-9]{64}$/,
  'Invalid transaction ID format'
)

// ============================================================================
// Staking Schemas
// ============================================================================

// Stake position
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

// Stake request
export const stakeRequestSchema = z.object({
  amount: stxAmountSchema,
  lockPeriod: z.number().int().min(1).max(365),
})

export type StakeRequest = z.infer<typeof stakeRequestSchema>

// Unstake request
export const unstakeRequestSchema = z.object({
  positionId: z.number().int().nonnegative(),
})

export type UnstakeRequest = z.infer<typeof unstakeRequestSchema>

// ============================================================================
// Rewards Schemas
// ============================================================================

// Reward info
export const rewardInfoSchema = z.object({
  pendingRewards: microStxSchema,
  claimedRewards: microStxSchema,
  totalRewards: microStxSchema,
  lastClaimBlock: blockHeightSchema.optional(),
  apr: z.number().min(0).max(100),
})

export type RewardInfo = z.infer<typeof rewardInfoSchema>

// Claim request
export const claimRequestSchema = z.object({
  positionIds: z.array(z.number().int().nonnegative()).optional(),
})

export type ClaimRequest = z.infer<typeof claimRequestSchema>

// ============================================================================
// Transaction Schemas
// ============================================================================

// Transaction status
export const transactionStatusSchema = z.enum([
  'pending',
  'success',
  'failed',
  'aborted',
])

// Transaction record
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

// Generic API response wrapper
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

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  total: z.number().int().nonnegative().optional(),
  hasMore: z.boolean().optional(),
})

export type Pagination = z.infer<typeof paginationSchema>

// ============================================================================
// Validation Helpers
// ============================================================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: z.ZodIssue[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Validate with detailed error reporting
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

// Safe validation (returns result instead of throwing)
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

// Validate Stacks address
export function isValidStacksAddress(address: string): boolean {
  return stacksAddressSchema.safeParse(address).success
}

// Validate transaction ID
export function isValidTxId(txId: string): boolean {
  return txIdSchema.safeParse(txId).success
}

// Validate STX amount
export function isValidStxAmount(amount: string): boolean {
  return stxAmountSchema.safeParse(amount).success
}

// Parse and validate micro-STX to STX
export function microStxToStx(microStx: number): number {
  const validated = microStxSchema.parse(microStx)
  return validated / 1_000_000
}

// Parse and validate STX to micro-STX
export function stxToMicroStx(stx: number | string): number {
  const amount = typeof stx === 'string' ? parseFloat(stx) : stx
  if (isNaN(amount) || amount < 0) {
    throw new Error('Invalid STX amount')
  }
  return Math.floor(amount * 1_000_000)
}

// ============================================================================
// Form Validation Schemas
// ============================================================================

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

export const withdrawFormSchema = z.object({
  positionId: z.number().int().nonnegative('Invalid position'),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(parseFloat(val)), 'Must be a valid number')
    .refine(val => parseFloat(val) > 0, 'Amount must be greater than 0'),
})

export type WithdrawFormData = z.infer<typeof withdrawFormSchema>

export default {
  validate,
  safeValidate,
  isValidStacksAddress,
  isValidTxId,
  isValidStxAmount,
  microStxToStx,
  stxToMicroStx,
}

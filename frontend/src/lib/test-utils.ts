// Test Utilities for Aegis Vault Frontend
// Provides mocking helpers, test data generators, and testing utilities

import { StakePosition, RewardInfo, ProtocolStats, UserStats, TransactionRecord } from './validation'

// ============================================================================
// Random Data Generators
// ============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 6): number {
  const value = Math.random() * (max - min) + min
  return parseFloat(value.toFixed(decimals))
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

function randomStacksAddress(prefix: 'SP' | 'ST' = 'SP'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let addr = prefix
  for (let i = 0; i < 38; i++) {
    addr += chars[randomInt(0, chars.length - 1)]
  }
  return addr
}

function randomTxId(): string {
  const hex = '0123456789abcdef'
  let txId = '0x'
  for (let i = 0; i < 64; i++) {
    txId += hex[randomInt(0, 15)]
  }
  return txId
}

// ============================================================================
// Mock Data Factories
// ============================================================================

export function createMockStakePosition(overrides?: Partial<StakePosition>): StakePosition {
  const startBlock = randomInt(100000, 150000)
  const lockPeriod = randomChoice([30, 60, 90, 180, 365])
  const blocksPerDay = 144 // ~144 blocks per day on Stacks
  
  return {
    staker: randomStacksAddress(),
    amount: randomInt(1000000, 1000000000000), // 1 STX to 1M STX in micro-STX
    lockPeriod,
    startBlock,
    endBlock: startBlock + lockPeriod * blocksPerDay,
    tier: randomInt(1, 5),
    rewards: randomInt(0, 100000000), // 0 to 100 STX in micro-STX
    status: randomChoice(['active', 'unlocked', 'withdrawn'] as const),
    ...overrides,
  }
}

export function createMockRewardInfo(overrides?: Partial<RewardInfo>): RewardInfo {
  const pending = randomInt(0, 10000000000) // 0 to 10K STX
  const claimed = randomInt(0, 50000000000) // 0 to 50K STX
  
  return {
    pendingRewards: pending,
    claimedRewards: claimed,
    totalRewards: pending + claimed,
    lastClaimBlock: randomInt(140000, 150000),
    apr: randomFloat(5, 25, 2),
    ...overrides,
  }
}

export function createMockProtocolStats(overrides?: Partial<ProtocolStats>): ProtocolStats {
  return {
    totalStaked: randomInt(1000000000000, 100000000000000), // 1M to 100M STX
    totalStakers: randomInt(100, 10000),
    totalRewardsDistributed: randomInt(100000000000, 10000000000000), // 100K to 10M STX
    currentAPR: randomFloat(8, 15, 2),
    tvl: randomInt(1000000000000, 100000000000000),
    treasuryBalance: randomInt(100000000000, 10000000000000),
    activePositions: randomInt(500, 50000),
    ...overrides,
  }
}

export function createMockUserStats(overrides?: Partial<UserStats>): UserStats {
  return {
    address: randomStacksAddress(),
    stakedBalance: randomInt(0, 10000000000000), // 0 to 10M STX
    availableBalance: randomInt(0, 1000000000000), // 0 to 1M STX
    pendingRewards: randomInt(0, 100000000), // 0 to 100 STX
    totalRewardsClaimed: randomInt(0, 1000000000), // 0 to 1K STX
    positionCount: randomInt(0, 10),
    tier: randomInt(0, 5),
    stakingPower: randomFloat(0, 100, 4),
    ...overrides,
  }
}

export function createMockTransaction(overrides?: Partial<TransactionRecord>): TransactionRecord {
  const types = ['stake', 'unstake', 'claim', 'transfer'] as const
  const statuses = ['pending', 'success', 'failed', 'aborted'] as const
  
  return {
    txId: randomTxId(),
    type: randomChoice([...types]),
    status: randomChoice([...statuses]),
    amount: randomInt(1000000, 100000000000),
    sender: randomStacksAddress(),
    recipient: randomStacksAddress(),
    blockHeight: randomInt(140000, 150000),
    timestamp: Date.now() - randomInt(0, 86400000 * 30), // Within last 30 days
    fee: randomInt(1000, 100000), // 0.001 to 0.1 STX
    ...overrides,
  }
}

// ============================================================================
// Mock Data Collections
// ============================================================================

export function createMockStakePositions(count = 5): StakePosition[] {
  return Array.from({ length: count }, () => createMockStakePosition())
}

export function createMockTransactionHistory(count = 20): TransactionRecord[] {
  return Array.from({ length: count }, () => createMockTransaction())
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
}

// ============================================================================
// API Response Mocks
// ============================================================================

export function createMockApiResponse<T>(data: T, success = true) {
  if (success) {
    return {
      success: true,
      data,
      timestamp: Date.now(),
    }
  }
  
  return {
    success: false,
    error: {
      code: 'MOCK_ERROR',
      message: 'Mock error for testing',
    },
    timestamp: Date.now(),
  }
}

export function createMockPaginatedResponse<T>(
  items: T[],
  page = 1,
  limit = 20,
  total?: number
) {
  const actualTotal = total ?? items.length
  const start = (page - 1) * limit
  const paginatedItems = items.slice(start, start + limit)
  
  return {
    success: true,
    data: paginatedItems,
    pagination: {
      page,
      limit,
      total: actualTotal,
      hasMore: start + paginatedItems.length < actualTotal,
    },
    timestamp: Date.now(),
  }
}

// ============================================================================
// Test Helpers
// ============================================================================

// Wait for async operations
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Create a mock function with tracking
export function createMockFn<T extends (...args: unknown[]) => unknown>() {
  const calls: Parameters<T>[] = []
  let mockReturnValue: ReturnType<T> | undefined
  let mockImplementation: T | undefined

  const fn = ((...args: Parameters<T>) => {
    calls.push(args)
    if (mockImplementation) {
      return mockImplementation(...args)
    }
    return mockReturnValue
  }) as T & {
    mock: {
      calls: Parameters<T>[]
      reset: () => void
      returnValue: (value: ReturnType<T>) => void
      implementation: (impl: T) => void
    }
  }

  fn.mock = {
    calls,
    reset: () => {
      calls.length = 0
      mockReturnValue = undefined
      mockImplementation = undefined
    },
    returnValue: (value: ReturnType<T>) => {
      mockReturnValue = value
    },
    implementation: (impl: T) => {
      mockImplementation = impl
    },
  }

  return fn
}

// Mock localStorage for testing
export function createMockLocalStorage() {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] || null,
  }
}

// Mock fetch for testing
export function createMockFetch() {
  const responses: Map<string, { status: number; data: unknown }> = new Map()

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const response = responses.get(url)

    if (!response) {
      return {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
        text: async () => 'Not found',
      }
    }

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
    }
  }

  mockFetch.mock = {
    setResponse: (url: string, status: number, data: unknown) => {
      responses.set(url, { status, data })
    },
    reset: () => {
      responses.clear()
    },
  }

  return mockFetch
}

// ============================================================================
// Wallet Testing Utilities
// ============================================================================

export const TEST_ADDRESSES = {
  valid: {
    mainnet: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    testnet: 'ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQYAC0RQ',
  },
  invalid: [
    'invalid-address',
    'SP',
    'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9E', // Too short
    '0x1234567890123456789012345678901234567890', // Ethereum format
  ],
}

export const TEST_TX_IDS = {
  valid: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  invalid: [
    '1234567890abcdef', // Missing 0x prefix
    '0x123', // Too short
    'invalid-tx-id',
  ],
}

// ============================================================================
// Render Test Helpers
// ============================================================================

export function createTestContext() {
  return {
    wallet: {
      address: TEST_ADDRESSES.valid.mainnet,
      isConnected: true,
      balance: 1000000000, // 1000 STX
    },
    protocol: createMockProtocolStats(),
    user: createMockUserStats({ address: TEST_ADDRESSES.valid.mainnet }),
  }
}

export default {
  createMockStakePosition,
  createMockRewardInfo,
  createMockProtocolStats,
  createMockUserStats,
  createMockTransaction,
  createMockStakePositions,
  createMockTransactionHistory,
  createMockApiResponse,
  createMockPaginatedResponse,
  wait,
  createMockFn,
  createMockLocalStorage,
  createMockFetch,
  createTestContext,
  TEST_ADDRESSES,
  TEST_TX_IDS,
}

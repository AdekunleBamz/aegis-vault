// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Stacks Network Types
export type StacksNetwork = 'mainnet' | 'testnet' | 'devnet';

/**
 * Configuration for a Stacks network connection (Mainnet, Testnet, or Devnet).
 */
export interface NetworkConfig {
  /** Descriptive name of the network */
  name: StacksNetwork;
  /** Chain ID (1 for mainnet, 2147483648 for testnet) */
  chainId: number;
  /** RPC URL for the Stacks Node */
  rpcUrl: string;
  /** Base URL for the explorer (e.g., explorer.stacks.co) */
  explorerUrl: string;
  /** Base URL for the Stacks API */
  apiUrl: string;
}

// Token Types
/**
 * Represents a fungible token on the Stacks blockchain.
 */
export interface Token {
  /** TokenTicker (e.g., STX, AGS) */
  symbol: string;
  /** Full name (e.g., Stacks, Aegis) */
  name: string;
  /** Number of decimal places (e.g., 6 for STX) */
  decimals: number;
  /** Fully qualified contract ID (optional for native STX) */
  contractAddress?: string;
  /** URL to the token icon */
  logoUrl?: string;
}

/**
 * Detailed balance 정보 for a specific token held by a user.
 */
export interface TokenBalance {
  /** The token metadata */
  token: Token;
  /** Raw balance in atomic units (e.g., micro-STX) */
  balance: bigint;
  /** User-friendly balance string with decimals */
  balanceFormatted: string;
  /** Estimated value in USD if price data is available */
  usdValue?: number;
}

// Wallet Types
/** Possible states of the wallet connection process */
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Global state for the user's wallet connection.
 */
export interface WalletState {
  /** Current connection status */
  status: WalletStatus;
  /** User's primary Stacks address */
  address: string | null;
  /** User's public key (hex) */
  publicKey: string | null;
  /** The network the wallet is currently targeting */
  network: StacksNetwork;
  /** Error message if status is 'error' */
  error?: string;
}

export interface WalletAdapter {
  name: string;
  icon: string;
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: unknown) => Promise<unknown>;
  isAvailable: () => boolean;
}

// Transaction Types
/** Lifecycle statuses for a blockchain transaction */
export type TransactionStatus = 
  | 'pending'     // Not yet submitted to the mempool
  | 'submitted'   // In the mempool, waiting for confirmation
  | 'confirmed'   // Successfully mined in a block
  | 'failed'      // Rejected by the network or failed execution
  | 'cancelled';  // Interrupted by the user

/** Supported protocol action types */
export type TransactionType =
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'withdraw'
  | 'approve'
  | 'transfer';

/**
 * Standardized transaction record for the internal history service.
 */
export interface Transaction {
  /** Unique internal ID or Stacks tx_id */
  id: string;
  /** On-chain transaction hash */
  txHash?: string;
  /** Type of action performed */
  type: TransactionType;
  /** Current mining/execution status */
  status: TransactionStatus;
  /** Amount involved in atomic units */
  amount?: bigint;
  /** Unix timestamp of creation */
  timestamp: number;
  /** Block height where the tx was confirmed */
  blockHeight?: number;
  /** Number of confirmations (anchor blocks) */
  confirmations?: number;
  /** User-facing error message if failed */
  error?: string;
  /** Additional protocol-specific metadata */
  metadata?: Record<string, unknown>;
}

export interface TransactionReceipt {
  txHash: string;
  status: 'success' | 'failed';
  blockHeight: number;
  gasUsed: bigint;
  events: TransactionEvent[];
}

export interface TransactionEvent {
  type: string;
  data: Record<string, unknown>;
}

// Staking Types
/** Classification of stakers based on amount and duration */
export type StakeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * Represents an active staking position in the protocol.
 */
export interface StakePosition {
  /** Unique position identifier */
  id: string;
  /** Owner's Stacks address */
  owner: string;
  /** amount of micro-STX locked */
  amount: bigint;
  /** Display string for the amount */
  amountFormatted: string;
  /** Required lock duration in blocks */
  lockPeriod: number;
  /** Block height when staking began */
  startBlock: number;
  /** Scheduled block height for unlock */
  endBlock: number;
  /** Estimated Date of unlock */
  unlockTime: Date;
  /** Derived reward tier */
  tier: StakeTier;
  /** Accrued but uncollected rewards */
  rewardsEarned: bigint;
  /** Display string for accrued rewards */
  rewardsEarnedFormatted: string;
  /** Effective Annual Percentage Yield */
  apy: number;
  /** High-level state of the position */
  status: 'active' | 'unlocking' | 'unlocked' | 'withdrawn';
}

export interface StakeConfig {
  minStakeAmount: bigint;
  maxStakeAmount: bigint;
  minLockPeriod: number;
  maxLockPeriod: number;
  earlyWithdrawalPenalty: number;
  tiers: TierConfig[];
}

export interface TierConfig {
  tier: StakeTier;
  minAmount: bigint;
  multiplier: number;
  benefits: string[];
  color: string;
  icon: string;
}

// Rewards Types
/**
 * Summary of a user's total rewards across all positions.
 */
export interface RewardSummary {
  /** Lifetime rewards accumulated */
  totalEarned: bigint;
  /** Rewards already transferred to wallet */
  totalClaimed: bigint;
  /** Rewards pending final protocol confirmation */
  pendingRewards: bigint;
  /** Rewards available for immediate claim */
  claimableRewards: bigint;
  /** Estimated time until next reward disbursement */
  nextRewardTime?: Date;
  /** Projected daily earnings based on current stake */
  estimatedDailyReward: bigint;
  /** Projected monthly earnings based on current stake */
  estimatedMonthlyReward: bigint;
}

export interface RewardHistory {
  id: string;
  amount: bigint;
  timestamp: Date;
  txHash: string;
  type: 'earned' | 'claimed';
}

// Protocol Stats Types
export interface ProtocolStats {
  totalValueLocked: bigint;
  totalValueLockedUsd: number;
  totalStakers: number;
  totalStaked: bigint;
  totalRewardsDistributed: bigint;
  averageApy: number;
  currentEpoch: number;
  nextEpochTime: Date;
}

export interface UserStats {
  totalStaked: bigint;
  totalRewardsEarned: bigint;
  totalRewardsClaimed: bigint;
  activePositions: number;
  tier: StakeTier;
  joinedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter & Sort Types
export interface FilterOptions {
  status?: string[];
  tier?: StakeTier[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minAmount?: bigint;
  maxAmount?: bigint;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  filters?: FilterOptions;
  sort?: SortOptions;
}

// Form Types
export interface StakeFormData {
  amount: string;
  lockPeriod: number;
  autoCompound: boolean;
}

export interface WithdrawFormData {
  positionId: string;
  amount: string;
  acceptPenalty: boolean;
}

export interface ClaimFormData {
  positionIds: string[];
  reinvest: boolean;
}

// Event Types
export interface StakeEvent {
  type: 'stake' | 'unstake' | 'claim' | 'tier-change';
  positionId: string;
  amount?: bigint;
  oldTier?: StakeTier;
  newTier?: StakeTier;
  timestamp: Date;
  txHash: string;
}

// Notification Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  currency: 'USD' | 'EUR' | 'GBP' | 'BTC' | 'STX';
  language: string;
  notifications: {
    email: boolean;
    browser: boolean;
    transactions: boolean;
    rewards: boolean;
    marketing: boolean;
  };
  slippage: number;
  gasPreference: 'slow' | 'normal' | 'fast';
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

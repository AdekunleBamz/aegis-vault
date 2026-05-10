/**
 * @file Type definitions for Aegis Vault
 *
 * Central type definitions for the application including network configuration,
 * tokens, wallets, transactions, staking, rewards, protocol stats, API responses,
 * form data, events, notifications, and user settings.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported Stacks network types.
 */
export type StacksNetwork = 'mainnet' | 'testnet' | 'devnet';

/**
 * Configuration for a Stacks network connection.
 */
export interface NetworkConfig {
  name: StacksNetwork;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  apiUrl: string;
}

/**
 * Token metadata.
 */
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  logoUrl?: string;
}

/**
 * Token balance with formatted display value.
 */
export interface TokenBalance {
  token: Token;
  balance: bigint;
  balanceFormatted: string;
  usdValue?: number;
}

/**
 * Current wallet connection status.
 */
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Complete wallet connection state.
 */
export interface WalletState {
  status: WalletStatus;
  address: string | null;
  publicKey: string | null;
  network: StacksNetwork;
  error?: string;
}

/**
 * Wallet adapter interface for connecting to different wallet providers.
 */
export interface WalletAdapter {
  name: string;
  icon: string;
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: unknown) => Promise<unknown>;
  isAvailable: () => boolean;
}

/**
 * Possible states for a transaction lifecycle.
 */
export type TransactionStatus =
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'failed'
  | 'cancelled';

/**
 * Types of transactions supported by the protocol.
 */
export type TransactionType =
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'withdraw'
  | 'approve'
  | 'transfer';

/**
 * Transaction record with full lifecycle tracking.
 */
export interface Transaction {
  id: string;
  txHash?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount?: bigint;
  timestamp: number;
  blockHeight?: number;
  confirmations?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Confirmed transaction receipt from the blockchain.
 */
export interface TransactionReceipt {
  txHash: string;
  status: 'success' | 'failed';
  blockHeight: number;
  gasUsed: bigint;
  events: TransactionEvent[];
}

/**
 * Event emitted during transaction execution.
 */
export interface TransactionEvent {
  type: string;
  data: Record<string, unknown>;
}

/**
 * Staking tier levels for reward multipliers.
 */
export type StakeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * User's staking position details.
 */
export interface StakePosition {
  id: string;
  owner: string;
  amount: bigint;
  amountFormatted: string;
  lockPeriod: number; // in blocks
  startBlock: number;
  endBlock: number;
  unlockTime: Date;
  tier: StakeTier;
  rewardsEarned: bigint;
  rewardsEarnedFormatted: string;
  apy: number;
  status: 'active' | 'unlocking' | 'unlocked' | 'withdrawn';
}

/**
 * Global staking protocol configuration.
 */
export interface StakeConfig {
  minStakeAmount: bigint;
  maxStakeAmount: bigint;
  minLockPeriod: number;
  maxLockPeriod: number;
  earlyWithdrawalPenalty: number;
  tiers: TierConfig[];
}

/**
 * Configuration for a single staking tier.
 */
export interface TierConfig {
  tier: StakeTier;
  minAmount: bigint;
  multiplier: number;
  benefits: string[];
  color: string;
  icon: string;
}

/**
 * Summary of a user's rewards across all positions.
 */
export interface RewardSummary {
  totalEarned: bigint;
  totalClaimed: bigint;
  pendingRewards: bigint;
  claimableRewards: bigint;
  nextRewardTime?: Date;
  estimatedDailyReward: bigint;
  estimatedMonthlyReward: bigint;
}

/**
 * Individual reward earning or claim record.
 */
export interface RewardHistory {
  id: string;
  amount: bigint;
  timestamp: Date;
  txHash: string;
  type: 'earned' | 'claimed';
}

/**
 * Global protocol statistics.
 */
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

/**
 * Per-user statistics summary.
 */
export interface UserStats {
  totalStaked: bigint;
  totalRewardsEarned: bigint;
  totalRewardsClaimed: bigint;
  activePositions: number;
  tier: StakeTier;
  joinedAt: Date;
}

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Paginated API response envelope.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Filter criteria for querying positions or transactions.
 */
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

/**
 * Sort configuration for list queries.
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Combined query options for paginated, filtered, sorted requests.
 */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  filters?: FilterOptions;
  sort?: SortOptions;
}

/**
 * Form data for creating a new stake position.
 */
export interface StakeFormData {
  amount: string;
  lockPeriod: number;
  autoCompound: boolean;
}

/**
 * Form data for withdrawing from a stake position.
 */
export interface WithdrawFormData {
  positionId: string;
  amount: string;
  acceptPenalty: boolean;
}

/**
 * Form data for claiming rewards.
 */
export interface ClaimFormData {
  positionIds: string[];
  reinvest: boolean;
}

/**
 * Event emitted when a staking action occurs.
 */
export interface StakeEvent {
  type: 'stake' | 'unstake' | 'claim' | 'tier-change';
  positionId: string;
  amount?: bigint;
  oldTier?: StakeTier;
  newTier?: StakeTier;
  timestamp: Date;
  txHash: string;
}

/**
 * Severity levels for user notifications.
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * User notification with optional action.
 */
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

/**
 * User preferences and application settings.
 */
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

/**
 * Recursively makes all properties optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Ensures specified keys are required.
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specified keys optional.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extracts the resolved value type from a Promise.
 * @example Awaited<Promise<StakePosition>> // StakePosition
 */
export type Resolved<T> = T extends Promise<infer U> ? U : T;

/**
 * A non-nullable version of a type — strips `null` and `undefined`.
 * @example NonNullish<string | null | undefined> // string
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

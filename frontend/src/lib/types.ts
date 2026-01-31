// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Stacks Network Types
export type StacksNetwork = 'mainnet' | 'testnet' | 'devnet';

export interface NetworkConfig {
  name: StacksNetwork;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  apiUrl: string;
}

// Token Types
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  logoUrl?: string;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  balanceFormatted: string;
  usdValue?: number;
}

// Wallet Types
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  publicKey: string | null;
  network: StacksNetwork;
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
export type TransactionStatus = 
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'failed'
  | 'cancelled';

export type TransactionType =
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'withdraw'
  | 'approve'
  | 'transfer';

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
export type StakeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

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
export interface RewardSummary {
  totalEarned: bigint;
  totalClaimed: bigint;
  pendingRewards: bigint;
  claimableRewards: bigint;
  nextRewardTime?: Date;
  estimatedDailyReward: bigint;
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

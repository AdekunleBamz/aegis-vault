/**
 * @file Application constants for Aegis Vault
 *
 * Centralized configuration including contract addresses, API endpoints,
 * staking tiers, time constants, and display settings.
 */

/**
 * Smart contract addresses for mainnet deployment.
 */
export const CONTRACTS = {
  VAULT: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-vault-v3',
  STAKING: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15',
  TREASURY: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury-v2-15',
  TOKEN: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-token-v2-15',
  WITHDRAWALS: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-withdrawals-v2-15',
  REWARDS: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-rewards-v2-15',
} as const;

/**
 * Stacks API configuration and endpoint paths.
 */
export const API = {
  STACKS_API: 'https://api.mainnet.hiro.so',
  ACCOUNTS_V2: '/v2/accounts',
  TRANSACTIONS_V1: '/extended/v1/address',
  EXPLORER: 'https://explorer.hiro.so',
} as const;

/**
 * Staking reward tier configurations with multipliers and base APY.
 */
export const TIERS = [
  { name: 'Bronze', minStake: 100, multiplier: 1.0, color: '#CD7F32', baseApy: 12 },
  { name: 'Silver', minStake: 1000, multiplier: 1.25, color: '#C0C0C0', baseApy: 15 },
  { name: 'Gold', minStake: 10000, multiplier: 1.5, color: '#FFD700', baseApy: 18 },
  { name: 'Platinum', minStake: 100000, multiplier: 2.0, color: '#E5E4E2', baseApy: 22 },
] as const;

/**
 * Number of blocks produced per day (10-minute block time).
 */
export const BLOCKS_PER_DAY = 144;
export const BLOCKS_PER_YEAR = 52560;
export const COOLDOWN_BLOCKS = 144;
export const BLOCK_TIME_MINUTES = 10;
export const USER_SESSION_INTERVAL = 1000;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;
export const SECONDS_PER_WEEK = 604800;
export const TRANSITION_DURATION = 0.3;
export const TRANSITION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Number of blocks produced per week.
 */
export const BLOCKS_PER_WEEK = 1008;

/**
 * Average time between blocks in minutes.
 */
export const AVG_BLOCK_TIME_MINUTES = 10;

/**
 * Decimal precision for STX token display formatting.
 */
export const STX_DECIMALS = 6;

/**
 * Decimal precision for AGS token display formatting.
 */
export const AGS_DECIMALS = 6;

/**
 * Unit conversion factor for STX denominated in microSTX.
 */
export const MICROSTX_PER_STX = 1_000_000;

/**
 * Minimum STX stake amount in STX.
 */
export const MIN_STX_STAKE_STX = 0.01;

/**
 * Maximum STX stake amount in STX.
 */
export const MAX_STX_STAKE_STX = 100000;

/**
 * Minimum lock period in days.
 */
export const MIN_LOCK_PERIOD_DAYS = 3;

/**
 * Maximum lock period in days.
 */
export const MAX_LOCK_PERIOD_DAYS = 30;

/**
 * Number of blocks in an approximate calendar month (144 blocks/day × 30 days).
 */
export const BLOCKS_PER_MONTH = 4320;

/**
 * Default duration in milliseconds for toast notifications.
 */
export const DEFAULT_TOAST_DURATION_MS = 5000;

/**
 * Maximum number of retry attempts for recoverable API errors.
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Interval in milliseconds for polling network block height.
 */
export const NETWORK_REFRESH_INTERVAL_MS = 25000;

/**
 * Interval in milliseconds for polling on-chain data in the UI.
 */
export const REFRESH_INTERVAL_MS = 30000;

/**
 * Time in milliseconds after which cached data is considered stale.
 */
export const STALE_AFTER_MS = 60000;

/**
 * Number of blocks in an approximate calendar quarter (144 blocks/day × 91 days).
 */
export const BLOCKS_PER_QUARTER = 13104;

/**
 * Cooldown period in blocks required between unstake request and withdrawal.
 */
export const UNSTAKE_COOLDOWN_BLOCKS = 288;

/**
 * Maximum number of reward entries shown in the rewards history display.
 */
export const MAX_DISPLAY_REWARDS = 50;

/**
 * Default number of items per paginated results page.
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Frozen enum of on-chain transaction lifecycle states.
 */
export const VAULT_TX_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  DROPPED: 'dropped',
} as const);

/**
 * Minimum AGS token balance required to participate in governance votes.
 */
export const MIN_GOVERNANCE_AGS = 100;

/**
 * Display labels for staking lock period options shown in the UI.
 */
export const LOCK_PERIOD_LABELS: Record<number, string> = {
  3: '3 days',
  7: '1 week',
  14: '2 weeks',
  30: '1 month',
};

/**
 * Character limit for user-provided position notes or labels.
 */
export const MAX_POSITION_NOTE_LENGTH = 120;

/**
 * Default UI theme for new Aegis Vault users.
 */
export const DEFAULT_THEME = 'dark';

/**
 * Number of blocks after which a pending transaction is considered stuck.
 * At ~10 min/block this is approximately 30 minutes.
 */
export const STUCK_TX_THRESHOLD_BLOCKS = 3;

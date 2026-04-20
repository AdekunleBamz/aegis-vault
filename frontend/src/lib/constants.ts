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

/**
 * Number of blocks produced per week.
 */
export const BLOCKS_PER_WEEK = 1008;

/**
 * Number of blocks produced per year.
 */
export const BLOCKS_PER_YEAR = 52560;

/**
 * Average time between blocks in minutes.
 */
export const AVG_BLOCK_TIME_MINUTES = 10;

/**
 * Cooldown period in blocks before rewards can be claimed.
 */
export const COOLDOWN_BLOCKS = 144;

/**
 * Decimal precision for STX token display formatting.
 */
export const STX_DECIMALS = 6;

/**
 * Decimal precision for AGS token display formatting.
 */
export const AGS_DECIMALS = 6;

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

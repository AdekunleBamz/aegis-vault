// Contract addresses for mainnet
export const CONTRACTS = {
  STAKING: {
    address: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
    name: 'aegis-staking-v2-15',
  },
  TOKEN: {
    address: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
    name: 'aegis-token-v2-15',
  },
  TREASURY: {
    address: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
    name: 'aegis-treasury-v2-15',
  },
  REWARDS: {
    address: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
    name: 'aegis-rewards-v2-15',
  },
  WITHDRAWALS: {
    address: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
    name: 'aegis-withdrawals-v2-15',
  },
} as const;

// Staking tiers configuration
export const STAKING_TIERS = [
  {
    level: 1,
    name: 'Bronze',
    minStake: 100,
    maxStake: 1000,
    apy: 8,
    lockPeriod: 4320, // ~30 days in blocks
    color: '#CD7F32',
  },
  {
    level: 2,
    name: 'Silver',
    minStake: 1000,
    maxStake: 10000,
    apy: 12,
    lockPeriod: 8640, // ~60 days in blocks
    color: '#C0C0C0',
  },
  {
    level: 3,
    name: 'Gold',
    minStake: 10000,
    maxStake: 100000,
    apy: 18,
    lockPeriod: 12960, // ~90 days in blocks
    color: '#FFD700',
  },
  {
    level: 4,
    name: 'Platinum',
    minStake: 100000,
    maxStake: undefined,
    apy: 25,
    lockPeriod: 25920, // ~180 days in blocks
    color: '#E5E4E2',
  },
] as const;

// Network configuration
export const NETWORK = 'mainnet' as const;
export const NETWORK_ID = 'mainnet' as const;

// App configuration
export const APP_NAME = 'Aegis Vault';
export const APP_ICON = '/aegis-icon.png';

// API endpoints
export const API_BASE_URL = 'https://api.hiro.so';
export const EXPLORER_URL = 'https://explorer.stacks.co';

// Staking constants
export const MIN_STAKE_AMOUNT = 100; // Minimum STX to stake
export const WITHDRAWAL_DELAY_BLOCKS = 144; // ~1 day
export const EMERGENCY_WITHDRAWAL_PENALTY = 10; // 10% penalty

// UI constants
export const REFRESH_INTERVAL = 30000; // 30 seconds
export const TX_POLL_INTERVAL = 10000; // 10 seconds

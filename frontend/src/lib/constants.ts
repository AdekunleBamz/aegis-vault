// Contract addresses for mainnet
export const CONTRACTS = {
  STAKING: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15',
  TREASURY: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury-v2-15',
  TOKEN: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-token-v2-15',
  WITHDRAWALS: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-withdrawals-v2-15',
  REWARDS: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-rewards-v2-15',
} as const;

// API endpoints
export const API = {
  STACKS_API: 'https://api.mainnet.hiro.so',
  EXPLORER: 'https://explorer.stacks.co',
} as const;

// Staking tiers
export const TIERS = [
  { name: 'Bronze', minStake: 100, multiplier: 1.0, color: '#CD7F32' },
  { name: 'Silver', minStake: 1000, multiplier: 1.25, color: '#C0C0C0' },
  { name: 'Gold', minStake: 10000, multiplier: 1.5, color: '#FFD700' },
  { name: 'Platinum', minStake: 100000, multiplier: 2.0, color: '#E5E4E2' },
] as const;

// Time constants
export const BLOCKS_PER_DAY = 144;
export const BLOCKS_PER_YEAR = 52560;
export const COOLDOWN_BLOCKS = 144;

// Display constants
export const STX_DECIMALS = 6;
export const AGS_DECIMALS = 6;

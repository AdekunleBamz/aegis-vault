// Contract addresses for mainnet
export const CONTRACTS = {
  // v3 consolidated vault contract (kept under legacy keys for compatibility)
  STAKING: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-vault-v3',
  WITHDRAWALS: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-vault-v3',
  REWARDS: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-vault-v3',
  TREASURY: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury',
  TOKEN: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-token-v3',
} as const;

// API endpoints
export const API = {
  STACKS_API: 'https://api.mainnet.hiro.so',
  EXPLORER: 'https://explorer.stacks.co',
} as const;

// Staking tiers
export const TIERS = [
  { name: 'Bronze', minStake: 100, multiplier: 1.0, color: '#CD7F32', baseApy: 12 },
  { name: 'Silver', minStake: 1000, multiplier: 1.25, color: '#C0C0C0', baseApy: 15 },
  { name: 'Gold', minStake: 10000, multiplier: 1.5, color: '#FFD700', baseApy: 18 },
  { name: 'Platinum', minStake: 100000, multiplier: 2.0, color: '#E5E4E2', baseApy: 22 },
] as const;

// Time constants
export const BLOCKS_PER_DAY = 144;
export const BLOCKS_PER_YEAR = 52560;
export const COOLDOWN_BLOCKS = 144;

// Display constants
export const STX_DECIMALS = 6;
export const AGS_DECIMALS = 6;

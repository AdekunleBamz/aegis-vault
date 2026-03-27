import { AegisVaultClient, LOCK_PERIOD_DAYS } from 'aegis-vault-sdk';
import { CONTRACTS, API } from './constants';

type CvTypedValue = {
  type?: string;
  value?: unknown;
};

const [deployerAddress] = CONTRACTS.STAKING.split('.');
const [, stakingContract] = CONTRACTS.STAKING.split('.');
const [, vaultContract] = CONTRACTS.VAULT.split('.');
const [, rewardsContract] = CONTRACTS.REWARDS.split('.');
const [, tokenContract] = CONTRACTS.TOKEN.split('.');
const [, treasuryContract] = CONTRACTS.TREASURY.split('.');

export const DEFAULT_LOCK_PERIOD_DAYS = LOCK_PERIOD_DAYS.includes(7) ? 7 : LOCK_PERIOD_DAYS[0];

export const aegisSdk = new AegisVaultClient({
  network: 'mainnet',
  apiBaseUrl: API.STACKS_API,
  deployerAddress,
  contracts: {
    staking: stakingContract,
    vault: vaultContract,
    rewards: rewardsContract,
    token: tokenContract,
    treasury: treasuryContract,
  },
});

function isCvTypedValue(value: unknown): value is CvTypedValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, 'type') &&
    Object.prototype.hasOwnProperty.call(value, 'value')
  );
}

export function normalizeCvValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(normalizeCvValue);
  }

  if (isCvTypedValue(value)) {
    const type = typeof value.type === 'string' ? value.type : '';

    if (type === 'uint' || type === 'int') {
      try {
        return BigInt(String(value.value));
      } catch {
        return BigInt(0);
      }
    }

    if (type === 'bool') {
      return Boolean(value.value);
    }

    if (type.includes('buff')) {
      return typeof value.value === 'string' ? value.value : '';
    }

    return normalizeCvValue(value.value);
  }

  if (typeof value === 'object') {
    const normalizedEntries = Object.entries(value as Record<string, unknown>).map(([k, v]) => [
      k,
      normalizeCvValue(v),
    ]);
    return Object.fromEntries(normalizedEntries);
  }

  return value;
}

export function asBigInt(value: unknown, fallback: bigint = BigInt(0)): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return BigInt(Math.trunc(value));
  if (typeof value === 'string' && value.trim() !== '') {
    try {
      return BigInt(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'bigint') return value !== BigInt(0);
  return fallback;
}

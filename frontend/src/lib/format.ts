import { STX_DECIMALS, AGS_DECIMALS } from './constants';

/**
 * Format microSTX to STX with proper decimals
 */
export function formatSTX(microStx: string | number | bigint): string {
  const value = BigInt(microStx);
  const stx = Number(value) / Math.pow(10, STX_DECIMALS);
  return stx.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

/**
 * Format AGS tokens with proper decimals
 */
export function formatAGS(microAgs: string | number | bigint): string {
  const value = BigInt(microAgs);
  const ags = Number(value) / Math.pow(10, AGS_DECIMALS);
  return ags.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

/**
 * Convert STX to microSTX
 */
export function toMicroSTX(stx: number): bigint {
  return BigInt(Math.floor(stx * Math.pow(10, STX_DECIMALS)));
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Format block height with commas
 */
export function formatBlockHeight(height: number): string {
  return height.toLocaleString('en-US');
}

/**
 * Calculate time remaining from blocks
 */
export function blocksToTime(blocks: number): string {
  const minutes = blocks * 10; // ~10 min per block
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''}`;
}

/**
 * Format relative time from timestamp
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return new Date(timestamp * 1000).toLocaleDateString();
}

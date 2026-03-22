import { STX_DECIMALS, AGS_DECIMALS, MICRO_STX_DENOMINATOR } from './constants';

/**
 * Formats micro-STX (uSTX) value to a human-readable STX string.
 * Uses the STX_DECIMALS constant for precision and formats with en-US locale.
 * 
 * @param microStx - The amount in micro-STX (string, number, or bigint)
 * @returns A formatted string representation in STX
 */
export function formatSTX(microStx: string | number | bigint): string {
  const value = BigInt(microStx);
  const stx = Number(value) / MICRO_STX_DENOMINATOR;
  return stx.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

/**
 * Formats micro-AGS (uAGS) value to a human-readable AGS string.
 * Uses the AGS_DECIMALS constant for precision and formats with en-US locale.
 * 
 * @param microAgs - The amount in micro-AGS (string, number, or bigint)
 * @returns A formatted string representation in AGS
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
 * Converts a STX amount to micro-STX (uSTX).
 * Handles decimal precision by multiplying with 10^STX_DECIMALS.
 * 
 * @param stx - The amount in STX as a number
 * @returns The amount in micro-STX as a bigint
 */
export function toMicroSTX(stx: number): bigint {
  return BigInt(Math.floor(stx * Math.pow(10, STX_DECIMALS)));
}

/**
 * Truncates a Stacks address for display by showing the first and last few characters.
 * 
 * @param address - The full Stacks address string
 * @param chars - The number of characters to show at the beginning and end (default: 4)
 * @returns A truncated address string (e.g., "SP2P...1234")
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Formats a numeric value as a percentage string with 2 decimal places.
 * 
 * @param value - The numeric percentage value
 * @returns A formatted percentage string (e.g., "12.34%")
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Formats a Stacks block height with thousands separators for better readability.
 * 
 * @param height - The numeric block height
 * @returns A locale-formatted string (e.g., "123,456")
 */
export function formatBlockHeight(height: number): string {
  return height.toLocaleString('en-US');
}

/**
 * Estimates the time represented by a number of Stacks blocks.
 * Assumes an average block time of 10 minutes.
 * 
 * @param blocks - The number of blocks
 * @returns A human-readable time string (e.g., "30 min", "2 hrs", "1 day")
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
 * Formats a Unix timestamp (in seconds) into a relative time string.
 * Shows minutes, hours, or days ago, or a formatted date for older timestamps.
 * 
 * @param timestamp - The Unix timestamp in seconds
 * @returns A human-readable relative time string (e.g., "5m ago", "2h ago", or date string)
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

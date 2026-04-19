/**
 * @file Format utilities for Aegis Vault
 * 
 * Provides formatting functions for STX tokens, AGS tokens, addresses,
 * percentages, block heights, and time durations.
 * 
 * @author Aegis Vault Team
 * @see {@link https://github.com/AdekunleBamz/aegis-vault}
 */

import { AVG_BLOCK_TIME_MINUTES, STX_DECIMALS, AGS_DECIMALS } from './constants';

/**
 * Format microSTX to STX with proper decimals.
 * 
 * STX uses 6 decimal places (microSTX). This function converts
 * microSTX values to human-readable STX format.
 * 
 * @param microStx - Amount in microSTX (1 STX = 1,000,000 microSTX)
 * @returns Formatted STX string with 2-6 decimal places
 * @example formatSTX(1000000) // "1.00"
 * @example formatSTX(1234567) // "1.234567"
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
 * Format AGS tokens with proper decimals.
 * 
 * AGS (Aegis governance token) uses 6 decimal places like STX.
 * This function converts microAGS values to human-readable format.
 * 
 * @param microAgs - Amount in microAGS (1 AGS = 1,000,000 microAGS)
 * @returns Formatted AGS string with 2-6 decimal places
 * @example formatAGS(1000000) // "1.00"
 * @example formatAGS(2500000) // "2.50"
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
 * Safe version of formatAGS that handles null, undefined, or zero values gracefully.
 */
export function safeFormatAGS(value: string | number | bigint | null | undefined): string {
  if (value === null || value === undefined) return '0.00';
  try {
    return formatAGS(value);
  } catch {
    return '0.00';
  }
}

/**
 * Safe version of formatSTX that handles null, undefined, or invalid values gracefully.
 */
export function safeFormatSTX(value: string | number | bigint | null | undefined): string {
  if (value === null || value === undefined) return '0.00';
  try {
    return formatSTX(value);
  } catch {
    return '0.00';
  }
}

/**
 * Convert STX to microSTX.
 * 
 * This is the inverse of formatSTX. Takes a human-readable STX amount
 * and converts it to the smallest unit (microSTX) for on-chain operations.
 * 
 * @param stx - Amount in STX (e.g., 1.5 for 1.5 STX)
 * @returns Amount in microSTX as bigint
 * @example toMicroSTX(1) // 1000000n
 * @example toMicroSTX(0.5) // 500000n
 */
export function toMicroSTX(stx: number): bigint {
  return BigInt(Math.floor(stx * Math.pow(10, STX_DECIMALS)));
}

/**
 * Convert AGS to microAGS.
 *
 * @param ags - Amount in AGS (e.g., 2.5 for 2.5 AGS)
 * @returns Amount in microAGS as bigint
 * @example toMicroAGS(1) // 1000000n
 */
export function toMicroAGS(ags: number): bigint {
  return BigInt(Math.floor(ags * Math.pow(10, AGS_DECIMALS)));
}

/**
 * Truncate a Stacks address for display.
 * 
 * Displays the first and last few characters of an address with an ellipsis
 * in between, making long addresses more readable in UI components.
 * 
 * @param address - The full Stacks address to truncate
 * @param chars - Number of characters to show at start and end (default: 4)
 * @returns Truncated address string (e.g., "SP3F...CGG6N")
 * @example truncateAddress("SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N") // "SP3F...CGG6N"
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= (chars * 2) + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number as a percentage string.
 * 
 * Converts a decimal number to a percentage string with 2 decimal places.
 * 
 * @param value - The decimal value to format (e.g., 12.5 for 12.5%)
 * @returns Formatted percentage string with % suffix
 * @example formatPercent(12.5) // "12.50%"
 * @example formatPercent(0) // "0.00%"
 */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0.00%';
  return `${value.toFixed(2)}%`;
}

/**
 * Format a block height with thousand separators.
 * 
 * Adds commas to block heights for improved readability in UI components.
 * 
 * @param height - The block height number to format
 * @returns Formatted string with comma separators
 * @example formatBlockHeight(1234567) // "1,234,567"
 */
export function formatBlockHeight(height: number): string {
  if (!Number.isFinite(height)) return '0';
  return height.toLocaleString('en-US');
}

/**
 * Convert block count to human-readable time duration.
 * 
 * Uses the average Stacks block time (10 minutes) to estimate
 * the time duration represented by a given number of blocks.
 * 
 * @param blocks - Number of blocks to convert
 * @returns Human-readable time string (e.g., "2 hr", "3 day")
 * @example blocksToTime(144) // "1 day" (144 blocks * 10 min = 1440 min = 24 hr)
 */
export function blocksToTime(blocks: number): string {
  if (!Number.isFinite(blocks) || blocks <= 0) return '0 min';
  const minutes = blocks * AVG_BLOCK_TIME_MINUTES;
  
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
 * Format a Unix timestamp as a relative time string.
 * 
 * Converts a Unix timestamp (seconds since epoch) to a human-readable
 * relative time string like "Just now", "5m ago", "2h ago", etc.
 * 
 * @param timestamp - Unix timestamp in seconds
 * @returns Relative time string describing how long ago the timestamp was
 * @example formatRelativeTime(Date.now() / 1000 - 3600) // "1h ago"
 * @example formatRelativeTime(Date.now() / 1000 - 30) // "Just now"
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

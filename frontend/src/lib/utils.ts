/**
 * @file Utility functions for Aegis Vault
 *
 * Provides general-purpose utility functions including CSS class merging,
 * address validation, and contract ID parsing.
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges CSS classes with Tailwind CSS conflict resolution.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a Stacks address is a mainnet address.
 * Mainnet addresses start with 'SP'.
 *
 * @param address - The Stacks address to check
 * @returns True if the address is a mainnet address
 */
export function isMainnetAddress(address: string): boolean {
  const normalized = typeof address === 'string' ? address.trim().toUpperCase() : '';
  return normalized.startsWith('SP');
}

/**
 * Splits a full contract ID into its address and name components.
 *
 * @param contractId - Full contract ID in format "address.contract-name"
 * @returns Tuple of [address, contractName]
 */
export function splitContractId(contractId: string): [string, string] {
  const [address = '', ...nameParts] = contractId.split('.');
  return [address, nameParts.join('.')];
}

/**
 * Checks if a Stacks address is a testnet address.
 * Testnet addresses start with 'ST'.
 *
 * @param address - The Stacks address to check
 * @returns True if the address is a testnet address
 */
export function isTestnetAddress(address: string): boolean {
  const normalized = typeof address === 'string' ? address.trim().toUpperCase() : '';
  return normalized.startsWith('ST');
}

/**
 * Validates that a string is a well-formed contract ID (address.name).
 *
 * @param contractId - The string to validate
 * @returns True if the string contains exactly one dot separating two non-empty parts
 */
export function isValidContractId(contractId: string): boolean {
  if (typeof contractId !== 'string') return false;
  const parts = contractId.split('.');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

/**
 * Checks if a Stacks address is a devnet/mocknet address.
 * Devnet addresses start with 'SN'.
 *
 * @param address - The Stacks address to check
 * @returns True if the address is a devnet address
 */
export function isDevnetAddress(address: string): boolean {
  const normalized = typeof address === 'string' ? address.trim().toUpperCase() : '';
  return normalized.startsWith('SN');
}

/**
 * Returns true if the address is a valid Stacks address on any network.
 *
 * @param address - The Stacks address to check
 * @returns True for mainnet (SP), testnet (ST), or devnet (SN) addresses
 */
export function isStacksAddress(address: string): boolean {
  return isMainnetAddress(address) || isTestnetAddress(address) || isDevnetAddress(address);
}

/**
 * Truncates a Stacks address for display, keeping leading and trailing chars.
 *
 * @param address - The address to truncate
 * @param startChars - Characters to keep at the start (default 6)
 * @param endChars - Characters to keep at the end (default 4)
 * @returns Truncated address string, e.g. "SP1234…5678"
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (typeof address !== 'string') return '';
  const trimmed = address.trim();
  if (trimmed.length <= startChars + endChars) return trimmed;
  return `${trimmed.slice(0, startChars)}…${trimmed.slice(-endChars)}`;
}

/**
 * Returns true if the value is a finite positive number (or numeric string).
 *
 * @param amount - The value to check
 * @returns True if the value represents a valid positive amount
 */
export function isValidAmount(amount: unknown): boolean {
  const n = Number(amount);
  return Number.isFinite(n) && n > 0;
}

/**
 * Clamps a numeric value to within [min, max].
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

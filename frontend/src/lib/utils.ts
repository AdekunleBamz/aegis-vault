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

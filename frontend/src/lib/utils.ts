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

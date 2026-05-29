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
 * Returns a standardized accessibility metadata object for UI components.
 * 
 * @param name - The human-readable name of the component
 * @param description - A brief description of the component's purpose
 * @returns An object with aria-label and role properties
 */
export function getComponentMetadata(name: string, description?: string) {
  return {
    'aria-label': description ? `${name}: ${description}` : name,
    'role': 'region' as const,
  };
}

const MAINNET_ADDRESS_PATTERN = /^S[PM][A-Z0-9]{39}$/;
const TESTNET_ADDRESS_PATTERN = /^ST[A-Z0-9]{39}$/;
const DEVNET_ADDRESS_PATTERN = /^SN[A-Z0-9]{39}$/;
const CONTRACT_ID_PATTERN = /^(S[PMTN][A-Z0-9]{2,39})\.([A-Za-z0-9][A-Za-z0-9._-]*)$/;

export function isMainnetAddress(address: string): boolean {
  return typeof address === 'string' && MAINNET_ADDRESS_PATTERN.test(address.trim());
}

export function isTestnetAddress(address: string): boolean {
  return typeof address === 'string' && TESTNET_ADDRESS_PATTERN.test(address.trim());
}

export function isDevnetAddress(address: string): boolean {
  return typeof address === 'string' && DEVNET_ADDRESS_PATTERN.test(address.trim());
}

export function isStacksAddress(address: string): boolean {
  return isMainnetAddress(address) || isTestnetAddress(address) || isDevnetAddress(address);
}

export function splitContractId(contractId: string): [string, string] | null {
  if (typeof contractId !== 'string') return null;
  const match = contractId.trim().match(CONTRACT_ID_PATTERN);
  if (!match) return null;
  return [match[1], match[2]];
}

export function isValidContractId(contractId: string): boolean {
  return splitContractId(contractId) !== null;
}

export function isValidAmount(amount: string | number): boolean {
  const value = typeof amount === 'string' ? Number(amount.trim()) : amount;
  return Number.isFinite(value) && value > 0;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function toTitleCase(value: string): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function truncateAddress(address: string): string {
  if (typeof address !== 'string') return '';
  const normalizedAddress = address.trim();
  if (!normalizedAddress) return '';
  if (normalizedAddress.length <= 12) return normalizedAddress;
  return `${normalizedAddress.slice(0, 6)}\u2026${normalizedAddress.slice(-4)}`;
}

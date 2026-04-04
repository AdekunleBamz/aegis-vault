import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if a Stacks address is a mainnet address
 */
export function isMainnetAddress(address: string): boolean {
  return address.startsWith('SP');
}

/**
 * Splits a full contract ID into address and name
 */
export function splitContractId(contractId: string): [string, string] {
  const parts = contractId.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('Invalid contract ID');
  }
  return [parts[0], parts[1]];
}

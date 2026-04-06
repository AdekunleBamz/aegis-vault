import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
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
  return [parts[0], parts[1]];
}

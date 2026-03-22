import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Splits a full contract ID into address and name
 */
export function splitContractId(contractId: string): [string, string] {
  const parts = contractId.split('.');
  return [parts[0], parts[1]];
}

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

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

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
 * @returns An object with aria-label and role properties for spread usage
 */
export function getComponentMetadata(name: string, description?: string) {
  return {
    'aria-label': description ? `${name}: ${description}` : name,
    'role': 'region' as const,
  };
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

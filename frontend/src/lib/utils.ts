import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
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

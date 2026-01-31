// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates a Stacks address
 */
export function isValidStacksAddress(address: string): boolean {
  if (!address) return false;
  // Mainnet: SP, Testnet: ST
  const regex = /^S[PT][0-9A-Z]{38,39}$/;
  return regex.test(address);
}

/**
 * Validates a principal (address or contract)
 */
export function isValidPrincipal(principal: string): boolean {
  if (!principal) return false;
  // Simple address or contract address
  if (principal.includes('.')) {
    const [addr, contractName] = principal.split('.');
    return isValidStacksAddress(addr) && /^[a-zA-Z][a-zA-Z0-9-]*$/.test(contractName);
  }
  return isValidStacksAddress(principal);
}

/**
 * Validates a transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  if (!hash) return false;
  // With or without 0x prefix
  const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;
  return /^[a-fA-F0-9]{64}$/.test(cleanHash);
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validates a URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a number string (integer or decimal)
 */
export function isValidNumber(value: string): boolean {
  if (!value || value.trim() === '') return false;
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

/**
 * Validates a positive number
 */
export function isPositiveNumber(value: string): boolean {
  return isValidNumber(value) && parseFloat(value) > 0;
}

/**
 * Validates an amount with max decimals
 */
export function isValidAmount(value: string, maxDecimals: number = 6): boolean {
  if (!isValidNumber(value)) return false;
  const parts = value.split('.');
  if (parts.length > 2) return false;
  if (parts.length === 2 && parts[1].length > maxDecimals) return false;
  return true;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncates an address for display
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars + 3) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Truncates a transaction hash for display
 */
export function truncateTxHash(hash: string, length: number = 8): string {
  if (!hash) return '';
  const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;
  if (cleanHash.length <= length * 2 + 3) return hash;
  return `${cleanHash.slice(0, length)}...${cleanHash.slice(-length)}`;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
}

/**
 * Converts a string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}

/**
 * Pluralizes a word based on count
 */
export function pluralize(word: string, count: number, plural?: string): string {
  if (count === 1) return word;
  return plural || `${word}s`;
}

/**
 * Generates a random string of specified length
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to specified decimal places
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a number with thousands separators
 */
export function formatNumberWithCommas(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Calculates percentage change between two values
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Formats a percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Groups an array by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Removes duplicates from an array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Removes duplicates by a key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Chunks an array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffles an array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Sorts an array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0;
  });
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Formats a date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | number | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${pluralize('minute', diffMins)} ago`;
  if (diffHours < 24) return `${diffHours} ${pluralize('hour', diffHours)} ago`;
  if (diffDays < 7) return `${diffDays} ${pluralize('day', diffDays)} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${pluralize('week', Math.floor(diffDays / 7))} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ${pluralize('month', Math.floor(diffDays / 30))} ago`;
  return `${Math.floor(diffDays / 365)} ${pluralize('year', Math.floor(diffDays / 365))} ago`;
}

/**
 * Formats a duration in milliseconds
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | number | string): boolean {
  const today = new Date();
  const check = new Date(date);
  return (
    check.getDate() === today.getDate() &&
    check.getMonth() === today.getMonth() &&
    check.getFullYear() === today.getFullYear()
  );
}

/**
 * Gets the start of day for a date
 */
export function startOfDay(date: Date | number | string): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Gets the end of day for a date
 */
export function endOfDay(date: Date | number | string): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep merges two objects
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (
        typeof targetValue === 'object' &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(targetValue as object, sourceValue as object);
      } else {
        (result as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }
  return result;
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Checks if an object is empty
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

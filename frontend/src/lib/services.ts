// ============================================================================
// STORAGE SERVICE
// ============================================================================

const STORAGE_PREFIX = 'aegis_vault_';

/**
 * Storage service with type safety and prefixing
 */
export const storage = {
  /**
   * Gets a value from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null;
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue ?? null;
    }
  },

  /**
   * Sets a value in localStorage
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * Removes a value from localStorage
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  /**
   * Clears all storage with prefix
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  },

  /**
   * Gets all keys with prefix
   */
  keys(): string[] {
    if (typeof window === 'undefined') return [];
    return Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.slice(STORAGE_PREFIX.length));
  },
};

// ============================================================================
// SESSION STORAGE SERVICE
// ============================================================================

export const sessionStore = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null;
    try {
      const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Session storage set error:', error);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(sessionStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    keys.forEach(key => sessionStorage.removeItem(key));
  },
};

// ============================================================================
// CACHED FETCH SERVICE
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export const cache = {
  /**
   * Gets a cached value
   */
  get<T>(key: string): T | null {
    const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.timestamp + entry.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return entry.data;
  },

  /**
   * Sets a cached value
   */
  set<T>(key: string, data: T, ttlMs: number = 60000): void {
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: ttlMs,
    });
  },

  /**
   * Removes a cached value
   */
  delete(key: string): void {
    memoryCache.delete(key);
  },

  /**
   * Clears all cache
   */
  clear(): void {
    memoryCache.clear();
  },

  /**
   * Gets or fetches with caching
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 60000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;
    
    const data = await fetcher();
    this.set(key, data, ttlMs);
    return data;
  },
};

// ============================================================================
// EVENT EMITTER SERVICE
// ============================================================================

type EventCallback<T = unknown> = (data: T) => void;

class EventEmitter {
  private events = new Map<string, Set<EventCallback>>();

  on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback as EventCallback);
    
    // Return unsubscribe function
    return () => this.off(event, callback as EventCallback);
  }

  off(event: string, callback: EventCallback): void {
    this.events.get(event)?.delete(callback);
  }

  emit<T = unknown>(event: string, data?: T): void {
    this.events.get(event)?.forEach(callback => callback(data));
  }

  once<T = unknown>(event: string, callback: EventCallback<T>): void {
    const wrapper: EventCallback<T> = (data) => {
      callback(data);
      this.off(event, wrapper as EventCallback);
    };
    this.on(event, wrapper);
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

export const events = new EventEmitter();

// Event types for the app
export const AppEvents = {
  WALLET_CONNECTED: 'wallet:connected',
  WALLET_DISCONNECTED: 'wallet:disconnected',
  TRANSACTION_SUBMITTED: 'tx:submitted',
  TRANSACTION_CONFIRMED: 'tx:confirmed',
  TRANSACTION_FAILED: 'tx:failed',
  STAKE_CREATED: 'stake:created',
  STAKE_UPDATED: 'stake:updated',
  REWARDS_CLAIMED: 'rewards:claimed',
  WITHDRAWAL_COMPLETED: 'withdrawal:completed',
  NETWORK_CHANGED: 'network:changed',
  ERROR_OCCURRED: 'error:occurred',
} as const;

// ============================================================================
// LOGGER SERVICE
// ============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  prefix: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig = {
    level: 'info',
    enabled: process.env.NODE_ENV !== 'production',
    prefix: '[Aegis Vault]',
  };

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} ${this.config.prefix} [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), data ?? '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), data ?? '');
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error ?? '');
    }
  }

  group(label: string): void {
    if (this.config.enabled) {
      console.group(this.formatMessage('info', label));
    }
  }

  groupEnd(): void {
    if (this.config.enabled) {
      console.groupEnd();
    }
  }

  time(label: string): void {
    if (this.config.enabled) {
      console.time(`${this.config.prefix} ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.config.enabled) {
      console.timeEnd(`${this.config.prefix} ${label}`);
    }
  }
}

export const logger = new Logger();

// ============================================================================
// RETRY SERVICE
// ============================================================================

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 'exponential',
    onRetry,
  } = options;

  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      onRetry?.(attempt, lastError);

      const delay = backoff === 'exponential'
        ? delayMs * Math.pow(2, attempt - 1)
        : delayMs * attempt;

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = limitMs - (now - lastCall);

    if (remaining <= 0) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  };
}

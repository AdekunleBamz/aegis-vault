// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Enumeration of standardized error codes used throughout the Aegis Vault application.
 * Helps in identifying specific error conditions for UI feedback and logic.
 */
export type ErrorCode =
  | 'WALLET_NOT_CONNECTED'           // No wallet extension detected or connected
  | 'WALLET_CONNECTION_REJECTED'     // User explicitly rejected the connection request
  | 'INSUFFICIENT_BALANCE'            // User does not have enough STX/tokens for the action
  | 'INSUFFICIENT_ALLOWANCE'          // Token allowance is too low for the requested transfer
  | 'TRANSACTION_REJECTED'            // User cancelled the transaction in their wallet
  | 'TRANSACTION_FAILED'              // Transaction broadcasted but failed on-chain
  | 'TRANSACTION_TIMEOUT'             // Transaction did not complete within expected time
  | 'NETWORK_ERROR'                   // API or blockchain node communication failure
  | 'CONTRACT_ERROR'                  // Smart contract logic or execution error
  | 'VALIDATION_ERROR'                // Input data failed pre-submission validation
  | 'RATE_LIMITED'                    // Too many requests to the Stacks API
  | 'NOT_FOUND'                       // Requested resource (account, tx, etc) not found
  | 'UNAUTHORIZED'                    // Action requires a different role or permission
  | 'UNKNOWN_ERROR';                   // Catch-all for unexpected failures

/**
 * Standard interface for error objects returned by the API or thrown by hooks.
 */
export interface AppError {
  /** Machine-readable error code */
  code: ErrorCode;
  /** Human-readable error message */
  message: string;
  /** Optional additional data about the error */
  details?: unknown;
  /** When the error occurred */
  timestamp: number;
  /** Whether the user can potentially fix this without developer intervention */
  recoverable: boolean;
}

// ============================================================================
// ERROR CLASS
// ============================================================================

/**
 * Custom error class for Aegis Vault that includes metadata like error codes and recoverability.
 * Extends the native Error class.
 */
export class AegisError extends Error {
  code: ErrorCode;
  details?: unknown;
  timestamp: number;
  recoverable: boolean;

  /**
   * @param code - The standardized error code
   * @param message - User-facing error message
   * @param details - Optional debug info
   * @param recoverable - Whether the action can be retried (default: true)
   */
  constructor(code: ErrorCode, message: string, details?: unknown, recoverable = true) {
    super(message);
    this.name = 'AegisError';
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
    this.recoverable = recoverable;
  }

  /**
   * Converts the error instance to a plain object for serialization.
   */
  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      recoverable: this.recoverable,
    };
  }

  /**
   * Static helper to wrap any unknown error into an AegisError instance.
   * 
   * @param error - The unknown error to wrap
   * @param defaultCode - Fallback error code (default: 'UNKNOWN_ERROR')
   */
  static fromError(error: unknown, defaultCode: ErrorCode = 'UNKNOWN_ERROR'): AegisError {
    if (error instanceof AegisError) return error;
    
    if (error instanceof Error) {
      return new AegisError(defaultCode, error.message, { originalError: error.name });
    }
    
    return new AegisError(defaultCode, String(error));
  }
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Default user-facing messages for each standardized error code.
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  WALLET_CONNECTION_REJECTED: 'Wallet connection was rejected. Please try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete this transaction.',
  INSUFFICIENT_ALLOWANCE: 'Please approve the token allowance first.',
  TRANSACTION_REJECTED: 'Transaction was rejected.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  TRANSACTION_TIMEOUT: 'Transaction timed out. Please check your wallet.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  CONTRACT_ERROR: 'Smart contract error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// ============================================================================
// ERROR HELPERS
// ============================================================================

/**
 * Creates a specific AegisError with its default standard message.
 * 
 * @param code - The error code to use
 * @param details - Additional debug info
 */
export function createError(code: ErrorCode, details?: unknown): AegisError {
  return new AegisError(code, ERROR_MESSAGES[code], details);
}

/**
 * Type guard to check if an unknown error is an AegisError with a specific code.
 * 
 * @param error - The error to check
 * @param code - The expected error code
 */
export function isErrorCode(error: unknown, code: ErrorCode): boolean {
  return error instanceof AegisError && error.code === code;
}

/**
 * Gets user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AegisError) {
    return error.message;
  }
  if (error instanceof Error) {
    // Parse common wallet error messages
    if (error.message.includes('User rejected')) {
      return ERROR_MESSAGES.TRANSACTION_REJECTED;
    }
    if (error.message.includes('insufficient')) {
      return ERROR_MESSAGES.INSUFFICIENT_BALANCE;
    }
    return error.message;
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Parses transaction error from Stacks
 */
export function parseTransactionError(error: unknown): AegisError {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('rejected') || message.includes('cancelled')) {
    return createError('TRANSACTION_REJECTED');
  }
  if (message.includes('insufficient')) {
    return createError('INSUFFICIENT_BALANCE');
  }
  if (message.includes('timeout')) {
    return createError('TRANSACTION_TIMEOUT');
  }
  if (message.includes('network') || message.includes('fetch')) {
    return createError('NETWORK_ERROR');
  }

  return new AegisError('TRANSACTION_FAILED', message, { originalError: error });
}

/**
 * Error boundary fallback props
 */
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// ============================================================================
// RESULT TYPE (FOR ERROR HANDLING WITHOUT EXCEPTIONS)
// ============================================================================

export type Result<T, E = AegisError> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok === true;
}

export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return result.ok === false;
}

/**
 * Wraps a promise to return a Result
 */
export async function tryCatch<T>(
  promise: Promise<T>,
  errorCode: ErrorCode = 'UNKNOWN_ERROR'
): Promise<Result<T>> {
  try {
    const value = await promise;
    return ok(value);
  } catch (error) {
    return err(AegisError.fromError(error, errorCode));
  }
}

// ============================================================================
// VALIDATION ERRORS
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationErrors extends AegisError {
  fields: ValidationError[];

  constructor(fields: ValidationError[]) {
    super('VALIDATION_ERROR', 'Validation failed', fields, true);
    this.fields = fields;
  }

  hasError(field: string): boolean {
    return this.fields.some(e => e.field === field);
  }

  getError(field: string): string | undefined {
    return this.fields.find(e => e.field === field)?.message;
  }

  static single(field: string, message: string): ValidationErrors {
    return new ValidationErrors([{ field, message }]);
  }
}

// ============================================================================
// ERROR REPORTING
// ============================================================================

interface ErrorReport {
  error: AppError;
  context: {
    url: string;
    userAgent: string;
    timestamp: number;
    wallet?: string;
  };
}

const errorReports: ErrorReport[] = [];

/**
 * Reports an error for analytics/debugging
 */
export function reportError(error: unknown, wallet?: string): void {
  const appError = error instanceof AegisError 
    ? error.toJSON() 
    : AegisError.fromError(error).toJSON();

  const report: ErrorReport = {
    error: appError,
    context: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      wallet,
    },
  };

  errorReports.push(report);

  // Keep only last 50 errors
  if (errorReports.length > 50) {
    errorReports.shift();
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error reported:', report);
  }

  // TODO: Send to error tracking service in production
}

/**
 * Gets recent error reports
 */
export function getErrorReports(): ErrorReport[] {
  return [...errorReports];
}

/**
 * Clears error reports
 */
export function clearErrorReports(): void {
  errorReports.length = 0;
}

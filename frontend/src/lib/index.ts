/**
 * @file Library barrel export for Aegis Vault
 * 
 * Central export point for all library modules including constants,
 * API utilities, error handling, types, validation, formatting, and services.
 */

// Core modules
export * from './constants';
export * from './staking';
export * from './stacks';
export * from './services';
export * from './test-utils';

/**
 * API utilities for Stacks blockchain interaction.
 * Transaction is aliased to avoid collision with types.ts
 */
export {
    getAccountBalance,
    getAccountTransactions,
    callReadOnlyFunction,
    getCurrentBlockHeight,
    type AccountBalance,
    type Transaction as StacksTransaction,
    type ContractReadResult
} from './api';

/**
 * Error handling utilities.
 * ValidationError is aliased to avoid collision with validation.ts
 */
export {
    AegisError,
    ERROR_MESSAGES,
    createError,
    isErrorCode,
    getErrorMessage,
    parseTransactionError,
    ok,
    err,
    isOk,
    isErr,
    tryCatch,
    ValidationErrors,
    reportError,
    getErrorReports,
    clearErrorReports,
    type ErrorCode,
    type AppError,
    type ErrorFallbackProps,
    type Result,
    type ValidationError as FieldValidationError
} from './errors';

/**
 * Type definitions - Primary source for application types.
 */
export * from './types';

/**
 * General utility functions - Primary source for utilities.
 */
export * from './utils';

/**
 * Zod validation schemas and helper functions.
 */
export {
    stacksAddressSchema,
    microStxSchema,
    stxAmountSchema,
    blockHeightSchema,
    txIdSchema,
    stakePositionSchema,
    stakeRequestSchema,
    unstakeRequestSchema,
    rewardInfoSchema,
    claimRequestSchema,
    transactionStatusSchema,
    transactionRecordSchema,
    protocolStatsSchema,
    userStatsSchema,
    apiResponseSchema,
    paginationSchema,
    stakeFormSchema,
    withdrawFormSchema,
    validate,
    safeValidate,
    isValidTxId,
    isValidStxAmount,
    microStxToStx,
    stxToMicroStx,
    ValidationError as ZodValidationError,
    type StakeRequest,
    type UnstakeRequest,
    type RewardInfo,
    type TransactionRecord,
    type Pagination
} from './validation';

/**
 * Formatting utilities for tokens, percentages, and time values.
 */
export {
    formatSTX,
    formatAGS,
    toMicroSTX,
    formatPercent,
    formatBlockHeight,
    blocksToTime
} from './format';

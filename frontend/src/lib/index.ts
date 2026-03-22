/**
 * Aegis Vault Core Library Entry Point
 * 
 * This file serves as the primary gateway for all shared logic in the frontend,
 * including constants, API clients, blockchain interaction, error handling,
 * and data validation. It uses named exports and aliases where necessary to 
 * ensure a clean and collision-free internal API.
 */

export * from './constants';
export * from './staking';
export * from './stacks';
export * from './services';
export * from './test-utils';

// API with aliased Transaction to avoid collision with types.ts
export {
    getAccountBalance,
    getAccountTransactions,
    callReadOnlyFunction,
    getCurrentBlockHeight,
    type AccountBalance,
    type Transaction as StacksTransaction,
    type ContractReadResult
} from './api';

// Errors with aliased ValidationError to avoid collision with validation.ts
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

// Types - Primary source for App types
export * from './types';

// Utils - Primary source for general utilities
export * from './utils';

// Validation - Export Zod schemas and specific utilities
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

// Format - Specific formatting functions
export {
    formatSTX,
    formatAGS,
    toMicroSTX,
    formatPercent,
    formatBlockHeight,
    blocksToTime
} from './format';

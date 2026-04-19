/**
 * @file Custom React hooks for Aegis Vault
 *
 * This module exports all custom hooks used throughout the application.
 * Hooks are organized by feature area: staking, withdrawals, rewards,
 * data fetching, form management, and UI utilities.
 */

/**
 * Staking operations - hooks for managing stake positions.
 */
export { useStaking } from './use-staking';

/**
 * Withdrawal operations - hooks for managing withdrawals.
 */
export { useWithdraw } from './use-withdraw';

/**
 * Rewards claiming - hooks for claiming accumulated rewards.
 */
export { useRewards } from './use-rewards';

/**
 * Contract interactions - hooks for reading from smart contracts.
 */
export { useContractRead } from './use-contract-read';

/**
 * Balance queries - hooks for fetching account balances.
 */
export { useBalances } from './use-balances';

/**
 * Position management - hooks for fetching staking positions.
 */
export { usePositions } from './use-positions';

/**
 * Transaction history - hooks for fetching transaction history.
 */
export { useTransactions } from './use-transactions';

/**
 * Network status - hooks for monitoring network state.
 */
export { useNetwork } from './use-network';

/**
 * UI utility hooks - hooks for common UI patterns.
 */
export {
  useLocalStorage,
  useDebounce,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrevious,
  useToggle,
  useInterval,
  useClickOutside,
  useWindowSize,
  useCopyToClipboard
} from './use-utils';

/**
 * Data fetching hooks - hooks for API calls and data loading.
 */
export {
  useFetch,
  useOptimistic,
  useInfiniteScroll,
  useMutation
} from './use-fetch';

/**
 * Form management hooks - hooks for form state and submission.
 */
export {
  useStepForm,
  useFormFields,
  useFormSubmit,
  useAutosave
} from './use-form';

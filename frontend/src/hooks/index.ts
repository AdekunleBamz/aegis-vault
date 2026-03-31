/**
 * @file Custom React hooks for Aegis Vault
 * 
 * This module exports all custom hooks used throughout the application.
 * Hooks are organized by feature area: staking, withdrawals, rewards,
 * data fetching, form management, and UI utilities.
 */

// Staking operations
export { useStaking } from './use-staking';
// Withdrawal operations
export { useWithdraw } from './use-withdraw';

// Rewards claiming
export { useRewards } from './use-rewards';

// Contract interactions
export { useContractRead } from './use-contract-read';

// Balance queries
export { useBalances } from './use-balances';

// Position management
export { usePositions } from './use-positions';

// Transaction history
export { useTransactions } from './use-transactions';

// Network status
export { useNetwork } from './use-network';

// UI utility hooks
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

// Data fetching hooks
export {
  useFetch,
  useOptimistic,
  useInfiniteScroll,
  useMutation
} from './use-fetch';

// Form management hooks
export {
  useStepForm,
  useFormFields,
  useFormSubmit,
  useAutosave
} from './use-form';

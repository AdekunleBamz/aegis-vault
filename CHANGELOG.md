# Changelog

All notable changes to Aegis Vault are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `BLOCKS_PER_MONTH`, `DEFAULT_TOAST_DURATION_MS`, `MAX_RETRY_ATTEMPTS`, and
  `NETWORK_REFRESH_INTERVAL_MS` constants in `lib/constants.ts`
- `isStacksAddress`, `truncateAddress`, and `isValidAmount` utilities in `lib/utils.ts`
- `formatCompactSTX` and `formatDuration` formatters in `lib/format.ts`
- `LOCK_PERIOD_NOT_ENDED` and `STAKING_CAP_REACHED` error codes in `lib/errors.ts`
- `isAegisError` type guard in `lib/errors.ts`
- `getFieldError` helper for extracting Zod field errors in `lib/validation.ts`
- `usePrevious` hook in `hooks/use-debounce.ts`
- `isStaking`, `stakeCount`, `lastStakedAt`, and `hasStaked` fields in `useStaking` return
- `isClaiming`, `hasError`, `claimCount`, and `lastClaimedAt` fields in `useRewards` return
- `isMainnet`, `isTestnet`, `isDevnet`, and `lastFetched` fields in `useNetwork` return
- `isIdle` and `completedAt` fields in `useWithdraw` return
- `hasStxBalance` and `hasAgsBalance` computed fields in `useBalances` return
- `count` and `hasTransactions` fields in `useTransactions` return
- `clearAll`, `toastSuccess`, and `toastError` convenience methods in `useToast`
- `isDark` and `isLight` computed values in `ThemeProvider` context

### Changed
- `useNetwork` refresh interval constant extracted to `NETWORK_REFRESH_INTERVAL_MS`
- `ThemeContextValue` interface extended with `isDark` and `isLight` fields

# Withdrawal State Refresh

## Summary
Withdrawal pages should refresh position state after a completed transaction.

## Checks
- Confirm cooldown and active-position states update together.
- Show stale-read copy if the indexer lags.
- Capture tx ID and vault ID in support handoffs.

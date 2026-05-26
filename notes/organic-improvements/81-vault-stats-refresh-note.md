# Vault Stats Refresh Note

## Summary
Vault stats QA should confirm totals refresh after stake, withdrawal, and reward claim transactions settle.

## Checks
- Capture vault stats before and after a successful stake.
- Repeat the check after a normal withdrawal or emergency withdrawal.
- Record the confirmation block when totals lag behind transaction settlement.

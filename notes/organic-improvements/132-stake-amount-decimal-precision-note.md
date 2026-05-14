# Stake Amount Decimal Precision

## Summary
Stake amount inputs should describe how decimal STX values are converted before signing.

## Checks
- Test decimal values near the minimum stake.
- Compare previewed micro-STX with the wallet prompt.
- Avoid silently rounding to zero.

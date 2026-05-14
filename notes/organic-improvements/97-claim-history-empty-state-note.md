# Claim History Empty State

## Summary
Claim history should distinguish no claims from a failed history read.

## Checks
- Test a fresh wallet and a wallet with failed API response.
- Confirm retry copy appears only for failed reads.
- Capture empty history in release notes when changed.

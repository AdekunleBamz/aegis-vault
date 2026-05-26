# Deposit Postcondition Note

## Summary
Deposit QA should verify staking transactions include postconditions that match the intended STX amount.

## Checks
- Compare the entered stake amount with the wallet postcondition preview.
- Test the smallest supported stake amount and a typical larger amount.
- Capture wallet provider details when postcondition copy differs from the app preview.

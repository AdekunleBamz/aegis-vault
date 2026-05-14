# Transaction Stepper Cancel Copy

## Summary
Transaction steppers should distinguish wallet cancellation from a failed on-chain transaction.

## Checks
- Cancel wallet prompts for stake, claim, and withdraw flows.
- Confirm cancelled steps can be retried.
- Keep transaction ids visible once broadcast.

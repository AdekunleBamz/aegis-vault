# Validation Error Source Note

## Summary
Validation error triage should identify whether a message came from frontend checks, wallet rejection, or contract response.

## Checks
- Reproduce the error with browser console and wallet prompt visible.
- Label the source as frontend validation, wallet, contract read, or transaction submit.
- Confirm duplicate messages are not shown for a single failed action.

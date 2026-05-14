# Status Pill Stale Read

## Summary
Status pills should show when their value is based on stale contract reads.

## Checks
- Simulate a failed refresh after a successful read.
- Confirm last-known values remain labeled.
- Keep stale and error states distinct.

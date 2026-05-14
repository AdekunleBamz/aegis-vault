# Fee Estimate Timeout

## Summary
Fee estimate reads should time out into a clear retry state instead of blocking forms.

## Checks
- Simulate slow fee reads.
- Confirm forms remain editable after timeout.
- Keep stale estimates labeled until refreshed.

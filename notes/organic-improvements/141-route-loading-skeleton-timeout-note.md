# Route Loading Skeleton Timeout

## Summary
Route-level skeletons should give way to an error or empty state after repeated read failures.

## Checks
- Simulate failed reads on dashboard and positions routes.
- Confirm skeletons do not persist forever.
- Provide a retry action after timeout.

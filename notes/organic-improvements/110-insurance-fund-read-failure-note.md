# Insurance Fund Read Failure

## Summary
Insurance fund widgets should degrade gracefully if a balance read fails.

## Checks
- Simulate a failed insurance fund read.
- Confirm other dashboard widgets continue rendering.
- Provide a retry action for the failed value.

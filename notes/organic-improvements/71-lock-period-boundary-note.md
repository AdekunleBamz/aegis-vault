# Lock Period Boundary Note

## Summary
Lock period QA should verify 3-day, 7-day, and 30-day stakes unlock at the documented block boundaries.

## Checks
- Test one stake at each supported lock period.
- Compare the displayed unlock state with the contract read for the stake ID.
- Record the block height when a boundary appears early or late.

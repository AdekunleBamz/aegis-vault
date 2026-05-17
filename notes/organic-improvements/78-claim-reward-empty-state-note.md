# Claim Reward Empty State Note

## Summary
Reward claim QA should confirm the empty state explains whether rewards are unavailable, already claimed, or still accruing.

## Checks
- Test a new stake, a claimed stake, and a stake with pending rewards.
- Confirm disabled claim actions include a specific reason.
- Record the reward contract read response when the UI state is unclear.

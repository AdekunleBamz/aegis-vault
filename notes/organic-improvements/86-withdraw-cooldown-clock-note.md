# Withdraw Cooldown Clock

## Summary
Cooldown messaging should use the same block-height source as withdraw eligibility checks.

## Checks
- Compare displayed cooldown against readonly contract output.
- Re-test after network reconnect.
- Note API staleness when block height does not advance.

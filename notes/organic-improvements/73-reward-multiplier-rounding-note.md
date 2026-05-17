# Reward Multiplier Rounding Note

## Summary
Reward multiplier reviews should verify 1.0x, 1.2x, and 1.5x tiers are displayed without misleading rounding.

## Checks
- Compare displayed multipliers with the selected lock period.
- Test small stake amounts where rounded rewards may look like zero.
- Record the raw contract value when the UI and reward preview differ.

# Release Contract Alias Note

## Summary
Release checks should verify frontend contract aliases still point at the intended v3 vault stack.

## Checks
- Compare aliases for vault, withdrawals, rewards, treasury, and token contracts.
- Confirm stale v2 aliases are not used in mainnet release evidence.
- Include alias diffs when contract environment files change.

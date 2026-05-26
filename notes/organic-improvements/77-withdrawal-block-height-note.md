# Withdrawal Block Height Note

## Summary
Withdrawal readiness checks should capture block height evidence before an unlock issue is filed.

## Checks
- Compare the current chain height with the stake's unlock height.
- Confirm the UI refreshes after a new block arrives.
- Include both heights in support notes when a withdrawal appears unavailable.

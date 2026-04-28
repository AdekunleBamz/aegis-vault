# Action Lock State

- Lock mutually exclusive actions while a transaction is pending.
- Keep read-only sections active so users can still inspect balances.
- This prevents conflicting submissions without freezing the interface.

- Include this checkpoint in the final release handoff review.

# Balance Refresh Trigger

- Trigger a balance refresh after every confirmed claim.
- Debounce refresh requests to avoid duplicate RPC bursts.
- This keeps totals accurate without extra network churn.

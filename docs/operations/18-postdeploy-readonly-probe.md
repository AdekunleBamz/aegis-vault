# Postdeploy read-only probe

Run read-only probes immediately after deployment so the frontend can verify active vault and reward contract availability.

## Checklist

- Call one read-only function for each deployed contract.
- Record the response value and block height in the deployment handoff.

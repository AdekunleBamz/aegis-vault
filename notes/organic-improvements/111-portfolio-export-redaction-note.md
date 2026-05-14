# Portfolio Export Redaction

## Summary
Portfolio exports should avoid including full wallet addresses unless the user explicitly requests them.

## Checks
- Review exported columns for positions, rewards, and activity.
- Redact addresses in support-shared files.
- Keep tx ids only when needed for reconciliation.

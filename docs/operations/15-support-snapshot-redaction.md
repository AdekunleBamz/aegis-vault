# Support snapshot redaction

Redact sensitive wallet and deployment details in support snapshots while preserving enough context for vault triage.

## Checklist

- Mask private labels, seed material, and unrelated account balances.
- Keep vault ID, network, transaction ID, and visible error copy.

# Generated Tsbuildinfo Handling

## Summary
Generated TypeScript build info should be reviewed before committing because it can contain local diagnostics.

## Checks
- Inspect generated build info after frontend builds.
- Commit it only when the repository intentionally tracks the update.
- Keep unrelated generated churn out of release commits.

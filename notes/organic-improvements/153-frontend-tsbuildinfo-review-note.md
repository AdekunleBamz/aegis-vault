# Frontend Tsbuildinfo Review

## Summary
Generated TypeScript build-info changes should be reviewed separately from product changes.

## Checks
- Inspect `frontend/tsconfig.tsbuildinfo` before staging.
- Avoid mixing generated diagnostics with feature commits.
- Rebuild once after dependency updates to confirm reproducibility.

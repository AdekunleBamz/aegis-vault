# SSR Local State Guard

## Summary
Local wallet and theme state should not cause server/client render mismatches.

## Checks
- Refresh routes with saved theme and wallet preferences.
- Confirm fallback content is stable before hydration.
- Recheck after adding new local storage reads.

# Frontend Build Artifact Note

## Summary
Frontend release reviews should confirm build artifacts do not include local wallets, env files, or stale tsbuild info.

## Checks
- Inspect the build output list before attaching release evidence.
- Exclude local wallet files and generated caches from screenshots or archives.
- Rebuild after dependency or environment changes before publishing a preview.

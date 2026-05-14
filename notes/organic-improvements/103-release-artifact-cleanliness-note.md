# Release Artifact Cleanliness

## Summary
After builds, keep generated artifacts and local deployment metadata out of commits.

## Checks
- Inspect git status after production build.
- Leave `.next/`, build info, and local env files uncommitted.
- Call out any intentional generated artifact in release notes.

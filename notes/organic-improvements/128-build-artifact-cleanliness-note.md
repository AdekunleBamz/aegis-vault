# Build Artifact Cleanliness

## Summary
Build outputs and local deployment metadata should stay out of commits unless intentionally tracked.

## Checks
- Inspect git status after frontend builds.
- Leave local `.next/` and deployment metadata uncommitted.
- Explain any intentional generated artifact in release notes.

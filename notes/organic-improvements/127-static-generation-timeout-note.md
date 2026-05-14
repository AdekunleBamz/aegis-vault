# Static Generation Timeout

## Summary
Next.js static generation retries should be captured so slow pages are not mistaken for failed builds.

## Checks
- Note pages that trigger static generation retries.
- Confirm the final production build exits successfully.
- Open follow-up work for repeated slow routes.

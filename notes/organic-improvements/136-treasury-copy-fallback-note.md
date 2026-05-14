# Treasury Copy Fallback

## Summary
Treasury address copy actions should recover when clipboard permissions are unavailable.

## Checks
- Deny clipboard permission and retry copy.
- Confirm manual selection fallback remains visible.
- Keep success and failure toasts distinct.

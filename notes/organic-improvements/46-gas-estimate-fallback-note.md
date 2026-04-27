# Gas Estimate Fallback

- If gas estimation fails, surface the last successful estimate with a warning label.
- Keep submission disabled until the user confirms the fallback estimate.
- This prevents silent overpay or underpriced retries.

# TS build info cleanliness note

Frontend builds can update `tsconfig.tsbuildinfo` during local verification.

Before committing, confirm the file is either intentionally tracked for the project or left out of unrelated changes.

This keeps build cache churn from hiding production code diffs.

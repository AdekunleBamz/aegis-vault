# Release Check Order Note

Run the contract check before collecting frontend build evidence for a Vercel release. Keeping that order makes the warning snapshot match the UI bundle being reviewed, and it avoids treating an old local build as deployment evidence.

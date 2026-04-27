# Network Retry Backoff

- Apply exponential backoff for failed read-only RPC calls.
- Surface the next retry countdown in debug mode.
- This improves clarity during temporary node instability.

# Wallet reconnect position cache

After wallet reconnect, cached positions should be marked stale until the first
successful contract read refreshes balances and claim status.

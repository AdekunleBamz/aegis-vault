# Wallet Mainnet Preflight Note

## Summary
Mainnet interaction checks should confirm the wallet network matches the deployed Aegis Vault contracts.

## Checks
- Verify the wallet is on mainnet before staking or withdrawing.
- Compare the connected contract principal with the README deployment list.
- Stop the flow if wallet and app network labels disagree.

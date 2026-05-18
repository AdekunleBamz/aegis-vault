# Mainnet deployer nonce check

Verify deployer nonce state before mainnet broadcasts so contract deployment plans do not collide with pending transactions.

## Checklist

- Check the deployer account nonce immediately before deployment.
- Record any pending transactions in the release handoff.

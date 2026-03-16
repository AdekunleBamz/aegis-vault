# Aegis Vault Contract Addresses

## Complete Contract Address Table

| Generation | Contract | Full Address | Status |
|------------|----------|--------------|--------|
| **V2 (Old)** | aegis-vault-v2 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-vault-v2` | Legacy |
| | aegis-treasury-v2 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-treasury-v2` | Legacy |
| | aegis-token-v2 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-token-v2` | Legacy |
| **V2-15 (Mainnet Active)** | aegis-staking-v2-15 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-staking-v2-15` | Active |
| | aegis-treasury-v2-15 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-treasury-v2-15` | Active |
| | aegis-token-v2-15 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-token-v2-15` | Active |
| | aegis-rewards-v2-15 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-rewards-v2-15` | Active |
| **V3 (Deployed)** | aegis-vault-v3 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-vault-v3` | Deployed |
| | aegis-token-v3 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.aegis-token-v3` | Deployed |

## Local Clarinet Aliases

The local manifest (`Clarinet.toml`) uses a few short contract aliases for development/testing:

| Manifest Alias | Contract File |
|----------------|---------------|
| `aegis-treasury` | `contracts/aegis-treasury-v2-15.clar` |
| `aegis-vault-v3` | `contracts/aegis-vault-v3.clar` |
| `aegis-token-v3` | `contracts/aegis-token-v3.clar` |

## Address Details

**Deployer Address:** `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`

All contracts are deployed from the same deployer address, which is the standard practice for contract suites in the Stacks ecosystem. The contract identifier format is:

```
<deployer-address>.<contract-name>
```

## Usage Notes

- **V2-15** is currently the production-active suite for staking/treasury/rewards flows
- **V3** contracts are deployed and available for migration/testing flows
- All addresses are on the mainnet Stacks blockchain
- The deployer address holds the administrative capabilities for all contracts

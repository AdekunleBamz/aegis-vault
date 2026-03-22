# Aegis Vault

A decentralized staking protocol built on the Stacks blockchain.

## Overview

Aegis Vault is a high-performance, decentralized staking protocol engineered for the Stacks ecosystem. It empowers users to maximize their STX capital efficiency through a sophisticated tiered multiplier system and algorithmic reward distribution.

### Key Features

- **Dynamic Staking Engine**: Institutional-grade staking logic supporting 3-day, 7-day, and 30-day commitment windows.
- **Yield Multipliers**: Optimized reward tiers (1.0x to 1.5x) designed to incentivize long-term protocol alignment.
- **Liquidity on Demand**: Integrated emergency withdrawal mechanism with a calibrated 2% penalty for immediate liquidity access.
- **AGS Governance Token**: Native SIP-010 rewards distributed proportionally to staking weight and duration.

## Architecture

The active protocol surface uses these contracts:

| Contract | Description |
|----------|-------------|
| `aegis-vault-v3` | Consolidated staking, withdrawal, and rewards logic |
| `aegis-treasury` | Treasury for penalty fees and protocol revenue |
| `aegis-token-v3` | AGS token (SIP-010 compliant) |

Legacy `v2` and `v2-15` contracts are retained in this repository for migration and reference.

## Tech Stack

### Smart Contracts
- **Clarity** - Smart contract language for Stacks
- **Clarinet** - Development and testing framework

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@stacks/connect** - Wallet connection
- **@stacks/transactions** - Transaction building

### Scripts
- **Node.js** - Automation scripts
- **@stacks/wallet-sdk** - Key derivation
- **@stacks/transactions** - Transaction signing

## Project Structure

```
aegis-vault/
├── contracts/           # Clarity smart contracts
│   ├── aegis-vault-v3.clar
│   ├── aegis-token-v3.clar
│   ├── aegis-treasury-v2-15.clar (published as `aegis-treasury`)
│   ├── aegis-vault-v2.clar (legacy)
│   ├── aegis-token-v2-15.clar (legacy)
│   └── traits/
├── frontend/            # Next.js frontend application
│   └── src/
│       ├── app/         # Pages (App Router)
│       ├── components/  # React components
│       ├── context/     # React context providers
│       ├── hooks/       # Custom hooks
│       └── lib/         # Utilities and helpers
├── tests/               # Contract tests
├── scripts/             # Automation scripts (private)
├── deployments/         # Deployment plans
└── settings/            # Network configurations
```

## Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher is required for the frontend and automation scripts.
- **Clarinet**: v2.0.0 or higher is required for smart contract development and local simulation.
- **Git**: Required for version control and cloning the repository.
- **Stacks Wallet**: Recommended (e.g., Leather or Xverse) for interacting with the protocol in a browser.

### Development Environment

For the best development experience, we recommend:
- **VS Code** with the **Clarity** extension for syntax highlighting and contract analysis.
- **Docker** for running local Stacks nodes if advanced integration testing is needed.

### Setup

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/aegis-vault.git
cd aegis-vault

# Install root dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install

### Environment Variables

Before running the frontend, ensure you have the necessary environment variables set in `frontend/.env.local`:

```
NEXT_PUBLIC_STACKS_API=https://api.mainnet.hiro.so
NEXT_PUBLIC_VAULT_ADDRESS=SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N
NEXT_PUBLIC_NETWORK=mainnet
```
```

## Development

### Smart Contracts

```bash
# Check contracts
clarinet check

# Run tests
clarinet test

# Run tests with vitest
npm test

# Console for local testing
# Use this to manually call functions and inspect state
clarinet console

# Run specific test file
# Example: clarinet test tests/aegis-vault-v3_test.ts
clarinet test <path-to-test>
```

### Frontend

```bash
# Development server
npm run frontend:dev

# Build for production
npm run frontend:build

# Start production server
npm --prefix frontend start
```

### Common Commands

| Command | Description |
|---------|-------------|
| `npm run frontend:dev` | Start frontend development server |
| `npm run frontend:build` | Build frontend for production |
| `clarinet check` | Check Clarity contract syntax |
| `clarinet test` | Run Clarity contract unit tests |
| `npm run test` | Run frontend unit tests with Vitest |
| `clarinet console` | Start interactive Clarity repl |

## Deployment

### Mainnet Deployment

Active contracts are deployed to Stacks mainnet at:

```
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-vault-v3
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-token-v3
```

### Deployment Plans

```bash
# Deploy to mainnet
clarinet deployments apply -p deployments/mainnet-v3-plan.yaml --no-dashboard
```

## Usage

### Staking

Users can stake STX with different lock periods:

| Lock Period | Duration | Reward Multiplier |
|-------------|----------|-------------------|
| 3 days | 432 blocks | 1.0x |
| 7 days | 1008 blocks | 1.2x |
| 30 days | 4320 blocks | 1.5x |

### Withdrawals

- **Normal withdrawal**: Available after lock period expires, returns full stake + rewards
- **Emergency withdrawal**: Available anytime, 2% penalty deducted

## API Reference

### Vault Contract (`aegis-vault-v3`)

```clarity
;; Stake STX with lock period (3, 7, or 30 days)
(stake (amount uint) (lock-period uint))

;; Request and complete withdrawal
(request-withdrawal (stake-id uint))
(complete-withdrawal)

;; Get vault statistics
(get-vault-stats)
```

### Token Contract (`aegis-token-v3`)

```clarity
;; Read token metadata
(get-name)
(get-symbol)
(get-decimals)
```

## Security

Aegis Vault prioritizes security at every layer of the stack:

- **Access Control**: Administrative functions are guarded by strict owner-only permissions.
- **Transactional Integrity**: Post-conditions are strictly enforced on all SIP-010 and STX transfers to prevent unauthorized state changes.
- **Protocol Safeguards**: Integrated emergency pause functionality for rapid response to unforeseen edge cases.
- **Architectural Isolation**: Withdrawal and treasury logic are decoupled from the core staking engine to minimize attack surfaces.

## License

MIT

## Links

- [Stacks Explorer](https://explorer.stacks.co/address/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N)
- [Stacks Documentation](https://docs.stacks.co)
- [@stacks/connect](https://github.com/hirosystems/connect)
- [@stacks/transactions](https://github.com/hirosystems/stacks.js)

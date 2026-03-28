# Aegis Vault

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)](https://github.com/AdekunleBamz/aegis-vault)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A decentralized staking protocol built on the Stacks blockchain.

## Overview

Aegis Vault is a high-performance, decentralized staking protocol engineered for the Stacks ecosystem. It empowers users to maximize their STX capital efficiency through a sophisticated tiered multiplier system and algorithmic reward distribution.

## Roadmap

- [x] Phase 1: Core Staking Logic & SIP-010 Integration
- [ ] Phase 2: Enhanced UI/UX & PWA Support (in progress)
- [ ] Phase 3: Multi-vault Strategy Support
- [ ] Phase 4: Decentralized Governance (DAO)

### Key Features

- **Dynamic Staking Engine**: Institutional-grade staking logic supporting 3-day, 7-day, and 30-day commitment windows.
- **Yield Multipliers**: Optimized reward tiers (1.0x to 1.5x) designed to incentivize long-term protocol alignment.
- **Liquidity on Demand**: Integrated emergency withdrawal mechanism with a calibrated 2% penalty for immediate liquidity access.
- **AGS Governance Token**: Native SIP-010 rewards distributed proportionally to staking weight and duration.

## Architecture

The active protocol surface in this repo is centered around the current v3 vault stack:

| Contract | Description |
|----------|-------------|
| `aegis-vault-v3` | Consolidated staking, reward accrual, and withdrawal flow |
| `aegis-token-v3` | AGS token implementation with mint control |
| `aegis-treasury-v2-15` | Treasury accounting for protocol-owned STX flows |

Legacy `v2` and `v2-15` contracts remain in `contracts/` for reference and migration context.

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
│   ├── aegis-treasury-v2-15.clar
│   ├── aegis-vault-v2.clar
│   ├── aegis-token-v2.clar
│   └── traits/
├── frontend/            # Next.js frontend application
│   └── src/
│       ├── app/         # Pages (App Router)
│       ├── components/  # React components
│       ├── context/     # React context providers
│       ├── hooks/       # Custom hooks
│       └── lib/         # Utilities and helpers
├── tests/               # Contract tests
├── notes/               # Operational notes and checklists
└── settings/            # Network configurations
```

## Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- Clarinet 2.0+ (latest stable recommended)
- Git 2.34+ (for better performance and security)

### Setup

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/aegis-vault.git
cd aegis-vault

# Install root dependencies
npm ci

# Install frontend dependencies
npm --prefix frontend ci

# Run project-wide checks
npm run check
```

## Development

### Smart Contracts

```bash
# Check contracts
clarinet check
npm run contracts:check

# Equivalent root script
npm run contracts:check
npm run check

# Run tests
clarinet test

# Equivalent root script
npm run contracts:test

# Run JavaScript/TypeScript tests with Vitest
npm run test

# Run focused validation utility tests
npm run test:validation

# Run a fast pre-push check bundle
npm run check:fast

# Console for local testing
npm run console
```

### Frontend

```bash
# Development server
npm run frontend:dev

# Lint frontend
npm run frontend:lint

# Run frontend tests
npm run frontend:test

# Build for production
npm run frontend:build

# Start production server
npm --prefix frontend start
```

## Deployment

### Mainnet Deployment

Contracts are deployed to Stacks mainnet at:

```
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-rewards-v2-15
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury-v2-15
```

Ensure wallet network is set to mainnet before interacting with these deployed contracts.

### Deployment Plans

Recommended pre-deployment verification:

```bash
npm run check
npm run contracts:test
npm run frontend:build
```

```bash
# Use Clarinet.toml as the source of truth for the active contract names
clarinet check
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

### Staking Contract

```clarity
;; Stake STX with lock period (3, 7, or 30 days)
(stake (amount uint) (lock-period uint))

;; Get user's stake IDs
(get-user-stake-ids (user principal))

;; Get stake details
(get-stake (staker principal) (stake-id uint))

;; Get vault statistics
(get-vault-stats)
```

### Withdrawals Contract

```clarity
;; Normal withdrawal (after lock expires)
(withdraw (stake-id uint))

;; Emergency withdrawal (2% penalty)
(emergency-withdraw (stake-id uint))
```

## Security

Aegis Vault prioritizes security at every layer of the stack:

- **Access Control**: Administrative functions are guarded by strict owner-only permissions.
- **Transactional Integrity**: Post-conditions are strictly enforced on all SIP-010 and STX transfers to prevent unauthorized state changes.
- **Protocol Safeguards**: Integrated emergency pause functionality for rapid response to unforeseen edge cases.
- **Architectural Isolation**: Withdrawal and treasury logic are decoupled from the core staking engine to minimize attack surfaces.

## License

[MIT](LICENSE)

## Links

- [Stacks Explorer](https://explorer.stacks.co/address/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N)
- [Stacks Documentation](https://docs.stacks.co)
- [@stacks/connect](https://github.com/hirosystems/connect)
- [@stacks/transactions](https://github.com/hirosystems/stacks.js)

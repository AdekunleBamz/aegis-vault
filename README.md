# Aegis Vault

A decentralized staking protocol built on the Stacks blockchain.

## Overview

Aegis Vault allows users to stake STX tokens and earn rewards through a tiered multiplier system. The protocol features:

- **Flexible staking** with 3-day, 7-day, and 30-day lock periods
- **Tiered rewards** based on lock duration (1x, 1.2x, 1.5x multipliers)
- **Emergency withdrawals** with 2% penalty for early unstaking
- **AGS token rewards** for stakers

## Architecture

The protocol consists of multiple smart contracts:

| Contract | Description |
|----------|-------------|
| `aegis-staking-v2-15` | Core staking logic, handles deposits and position tracking |
| `aegis-withdrawals-v2-15` | Withdrawal processing with lock period enforcement |
| `aegis-rewards-v2-15` | Reward calculation and distribution |
| `aegis-treasury-v2-15` | Treasury for penalty fees and protocol revenue |
| `aegis-token-v2-15` | AGS token (SIP-010 compliant) |

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
│   ├── aegis-staking-v2-15.clar
│   ├── aegis-withdrawals-v2-15.clar
│   ├── aegis-rewards-v2-15.clar
│   ├── aegis-treasury-v2-15.clar
│   ├── aegis-token-v2-15.clar
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
- Node.js 18+
- Clarinet 2.0+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/aegis-vault.git
cd aegis-vault

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
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
clarinet console
```

### Frontend

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Mainnet Deployment

Contracts are deployed to Stacks mainnet at:

```
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-withdrawals-v2-15
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-rewards-v2-15
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury-v2-15
SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-token-v2-15
```

### Deployment Plans

```bash
# Deploy to mainnet
clarinet deployments apply -p deployments/v2-15-mainnet-plan.yaml --no-dashboard
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

- All contracts have owner-only admin functions
- Post-conditions enforced on all token transfers
- Emergency pause functionality available
- Withdrawal contract separation for added security

## License

MIT

## Links

- [Stacks Explorer](https://explorer.stacks.co/address/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N)
- [Stacks Documentation](https://docs.stacks.co)
- [@stacks/connect](https://github.com/hirosystems/connect)
- [@stacks/transactions](https://github.com/hirosystems/stacks.js)

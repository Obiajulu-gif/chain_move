# ChainMove

ChainMove is a mobility finance platform being positioned for Arbitrum. It combines fractional vehicle ownership, pay-to-own driver financing, and operations tooling for investors, drivers, and administrators in one product stack.

The repository currently contains the application layer: onboarding, wallets, pool investing flows, payment rails, dashboards, and backend APIs. The Arbitrum contract layer is the next major integration step.

## Why ChainMove

Informal transport financing is still fragmented in many markets. Drivers face high daily settlement pressure, operators lack transparent records, and investors struggle to access structured, verifiable mobility assets.

ChainMove addresses that gap with:

- asset-backed investment pools for transport vehicles
- pay-to-own driver workflows with clearer repayment visibility
- embedded wallet onboarding for non-technical users
- internal wallet and payment rails for recurring funding flows
- admin and reporting surfaces for platform operations

## Why Arbitrum

Arbitrum is the intended onchain home for ChainMove because it fits the product's transaction pattern and developer needs:

- low-fee execution for frequent repayment, contribution, and distribution flows
- EVM compatibility for wallet tooling, contract development, and integrations
- strong fit for tokenized real-world asset primitives, governance, and treasury logic
- clear path from testnet development on Arbitrum Sepolia to production deployment on Arbitrum One

## Current Product Surface

The current codebase already supports a meaningful offchain and wallet-enabled product:

- investor flows for browsing pools, funding wallets, tracking positions, and viewing governance token screens
- driver flows for onboarding, repayment tracking, and ownership progression
- admin views for users, investors, reports, KYC, and fleet operations
- Privy-based authentication with embedded wallet provisioning
- Paystack-backed fiat funding into an internal NGN wallet
- Paystack dedicated virtual accounts for driver repayment collection
- MongoDB-backed APIs for pools, investments, transactions, and user state

## Arbitrum Alignment Note

This README reflects the target Arbitrum direction of the project.

Today, the repo already uses EVM-compatible tooling such as `Privy` and `viem`, but the full Arbitrum contract integration is not yet wired end-to-end in this repository. Some development wallet configuration still points to a temporary non-Arbitrum testnet and should be switched to Arbitrum Sepolia as part of the next integration pass.

In practical terms:

- the product and backend foundations are here
- the Arbitrum ownership, payout, and governance contracts are the next layer
- README language, roadmap, and contribution guidance below are written for that Arbitrum path

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS + Radix UI
- MongoDB + Mongoose
- Privy for auth and embedded wallets
- `viem` for EVM wallet and chain interactions
- Paystack for fiat payment flows
- Resend for email delivery

## Architecture Overview

```text
[Next.js Frontend]
Investor + Driver + Admin dashboards
                |
                v
[Route Handlers / Domain Services]
Auth | Pools | Investments | Payments | Wallets | Reports
                |
                v
[MongoDB]
Users | Pools | Investments | Transactions | Operations data
                |
                v
[Arbitrum Integration Layer - planned]
Ownership contracts | Treasury flows | Payouts | Governance
```

## Local Development

This repository contains both `package-lock.json` and `bun.lock`. `npm` is the safest default unless your team is standardizing on Bun.

1. Clone the repository:

```bash
git clone https://github.com/Obiajulu-gif/chain_move.git
cd chain_move
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` and set the required variables:

```bash
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PRIVY_APP_ID=<your_privy_app_id>
PRIVY_APP_SECRET=<your_privy_app_secret>
PRIVY_JWKS_URL=<your_privy_jwks_url>
PAYSTACK_SECRET_KEY=<optional_if_testing_payments>
PAYSTACK_DVA_PREFERRED_BANK=<optional_paystack_bank_slug>
RESEND_API_KEY=<optional_if_testing_emails>
```

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Notes

- `MONGODB_URI` and `JWT_SECRET` are required for application and session state.
- `NEXT_PUBLIC_PRIVY_APP_ID`, `PRIVY_APP_SECRET`, and `PRIVY_JWKS_URL` are required for Privy-backed auth and embedded wallets.
- `PAYSTACK_SECRET_KEY` is required for wallet funding flows.
- `PAYSTACK_DVA_PREFERRED_BANK` optionally overrides the bank slug used when provisioning Paystack dedicated virtual accounts. For test keys, the app defaults to `test-bank`.
- `RESEND_API_KEY` is only needed for email features.

## Driver Dedicated Repayment Accounts

Drivers with an active hire-purchase contract can now receive a Paystack dedicated virtual account in the repayment center.

- the account is provisioned automatically when the driver loads the repayment center and has the required profile fields
- bank transfers into that account are matched to the driver's active contract through the Paystack webhook
- overpayments still apply only up to the contract balance, with any excess credited to the driver's internal balance
- the existing Paystack checkout repayment flow remains available as a fallback if provisioning fails or the driver cannot use bank transfer

### Driver Profile Requirements

The dedicated virtual account flow currently requires:

- email
- name / full name
- phone number

If Paystack DVA eligibility for the business requires additional customer identification beyond those fields, the app surfaces the upstream error and leaves the fallback checkout flow available.

## Suggested Arbitrum Integration Path

- switch supported wallet chains and explorer links to Arbitrum Sepolia
- add contract interfaces for vehicle pool ownership and payout logic
- move governance voting from app state to contract-backed execution
- anchor payout receipts and treasury actions to Arbitrum events
- promote production settlement flows to Arbitrum One when the contract layer is ready

## Contribution Guide

When contributing, keep changes small and explicit, and document whether your work affects:

- application UX
- backend and payment behavior
- wallet flows
- Arbitrum integration assumptions

If you touch chain-related code or docs, keep naming consistent with the target stack:

- use `Arbitrum Sepolia` for development references
- use `Arbitrum One` for production references
- avoid reintroducing stale Stellar wording into product or architecture docs

Before opening a PR, run:

```bash
npm run lint
```

## Roadmap

### Near-term

- finalize wallet configuration for Arbitrum Sepolia
- harden investor and driver onboarding flows
- improve pool investing and wallet funding UX
- add clearer payout and ownership reporting

### Mid-term

- implement Arbitrum-backed ownership contracts
- add automated payout and treasury accounting flows
- wire governance actions to onchain execution
- improve analytics for investor transparency and driver repayment performance

## License

TBD. Recommended options: `MIT` or `Apache-2.0`.

## Contact

- Email: [okoyeemmanuelobiajulu@gmail.com](mailto:okoyeemmanuelobiajulu@gmail.com)
- X: [https://x.com/chainmove1](https://x.com/chainmove1)
- LinkedIn: [https://www.linkedin.com/company/chainmove/](https://www.linkedin.com/company/chainmove/)

# ChainMove

ChainMove — Asset-backed mobility co-ownership and pay-to-own rails built on Stellar.

## Why ChainMove

Informal transport financing in many markets is still fragmented and opaque. Drivers often face daily settlement pressure, investors lack transparent ownership rails, and operators have limited tools to verify payouts, performance, and trust at scale.

ChainMove addresses this by structuring mobility financing around verifiable ownership, predictable pay-to-own operations, and transparent records.

## What It Does

- **For investors**
  - Fractional ownership of real vehicles
  - Structured participation in mobility asset performance
  - Transparent payout and ownership records
- **For drivers**
  - Pay-to-own path to vehicle ownership
  - Clear repayment expectations and progress visibility
  - High-level onboarding and verification flow
- **For the platform**
  - Monitoring dashboard for operations and repayment activity
  - Unified rails for ownership records, settlements, and reporting
  - Extensible modules for compliance, payout orchestration, and analytics

## Built on Stellar

ChainMove is designed to leverage **Stellar** for core ownership and payout rails.

- Uses Stellar to support transparent ownership and payout transaction rails.
- Leverages Stellar’s fast, low-fee settlement model for recurring micro/weekly payments.
- Planned asset representation modules include Stellar Assets for vehicle-share tokenization.
- Uses on-chain proofs and auditable transaction records to improve trust and dispute resolution.

Note: Stellar modules are being developed with a staged rollout approach (testnet-first), and this repository documents the product and contributor path for that integration.

## How ChainMove Helps the Stellar Ecosystem

- **Real-world utility / RWA**: applies Stellar rails to real asset-backed mobility financing and ownership proofs.
- **Payment volume & on-chain activity**: recurring driver payments and investor distributions can generate consistent transaction throughput.
- **Wallet adoption**: encourages practical Stellar wallet usage for drivers and investors, including stable-value settlement flows.
- **On/Off-ramp synergy**: aligns with local fiat ramp workflows for real-world usage and adoption.
- **Developer ecosystem**: opens contributor tracks for Stellar payment, asset issuance, payout, and analytics modules.
- **Trust & transparency**: auditable payout trails reduce disputes and increase confidence in tokenized RWAs.

## Architecture Overview

```text
[Next.js App Router Frontend]
        Investor + Driver portals
                 |
                 v
[API Layer (Next.js route handlers)]
      |                      |
      v                      v
[MongoDB / Storage]   [Stellar Integration Layer*]
                           |
                           v
                [Assets, Payments, Payout Receipts]

*Stellar integration is planned/in-progress and targeted for testnet-first rollout.
```

Current codebase includes a Next.js frontend, API route handlers, and MongoDB-backed models. Stellar modules are architected as integration components to be layered into payout and ownership flows.

## Getting Started (Local Setup)

This repo includes `pnpm-lock.yaml`, so `pnpm` is the recommended package manager.

1. Clone the repository:
   ```bash
   git clone https://github.com/Obaijulu-gif/chain_move.git
   cd chain_move
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create `.env.local` and set required variables:
   ```bash
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   PAYSTACK_SECRET_KEY=<optional_if_testing_payments>
   RESEND_API_KEY=<optional_if_testing_emails>
   ```
4. Start local development:
   ```bash
   pnpm dev
   ```
5. Open `http://localhost:3000`.

## Contribution Guide (Drip Wave Ready)

This repository is structured for contributor-program onboarding with scoped tasks, modular component patterns, roadmap visibility, and issue-label based triage.

### How to contribute

1. Pick an issue (or propose one) aligned to roadmap priorities.
2. Create a branch: `feat/<short-name>` or `fix/<short-name>`.
3. Implement scoped changes with clear commit messages.
4. Run checks before opening PR:
   ```bash
   pnpm lint
   ```
5. Open a PR with:
   - Problem statement and approach
   - Screenshots/video for UI changes
   - Test notes and known limitations

### Repo hygiene and modular contribution expectations

- Keep PRs focused and small.
- Prefer reusable components over one-off page logic.
- Document assumptions and TODOs in PR descriptions.
- Add/update issue labels for clear triage and ownership.

Recommended labels:
- `good first issue`
- `help wanted`
- `stellar`
- `frontend`
- `backend`
- `a11y`
- `performance`
- `docs`

### Good first issues

- UI improvements for onboarding and auth flows
- Accessibility passes for forms and dashboard interactions
- Stellar integration scaffolding (transaction client wiring)
- Dashboard performance improvements
- Documentation and contributor onboarding updates

### Contributor Tracks (Stellar-focused)

- **Track A: Stellar payments module** (driver settlements)
- **Track B: Stellar asset model** (vehicle share representation)
- **Track C: Payout distribution + reporting**
- **Track D: Indexing/analytics** (explorer links, receipts)

### Code of Conduct

Contributors are expected to collaborate respectfully, provide constructive review feedback, and prioritize user safety, transparency, and data integrity.

## Roadmap

### Near-term

- Auth and onboarding UX hardening
- Stellar testnet integration baseline
- Transaction receipt surfaces in driver/investor dashboards
- Initial payout flow instrumentation and logs

### Mid-term

- Stellar asset issuance model for vehicle-share representation
- Payout automation for recurring settlement cycles
- Explorer-linked reporting and auditable receipts
- Expanded analytics for repayment reliability and investor transparency

## License

TBD. Recommended options: **MIT** or **Apache-2.0**.

## Contact

- Email: [okoyeemmanuelobiajulu@gmail.com](mailto:okoyeemmanuelobiajulu@gmail.com)
- X: [https://x.com/chainmove1](https://x.com/chainmove1)
- LinkedIn: [https://www.linkedin.com/company/chainmove/](https://www.linkedin.com/company/chainmove/)

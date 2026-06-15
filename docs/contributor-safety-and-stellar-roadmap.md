# ChainMove Contributor Safety, CI, Mock Mode, and Stellar Roadmap

This document prepares ChainMove for safe GrantFox contribution without requiring contributors to access maintainer credentials.

## Security audit summary

Current strengths:

- Privy is already the auth layer and server routes verify Privy identity before syncing users.
- Session cookies are HTTP-only and signed server-side.
- Paystack webhook handling validates the `x-paystack-signature` before processing charge events.
- KYC documents are encrypted before upload to Vercel Blob.
- `.gitignore` now allows `.env.example` while continuing to ignore real `.env*` files.

Current risks / gaps:

- `.env.example` was missing, which made contributor setup unsafe and unclear.
- CI was missing, so contributors had no standard lint/type/build gate.
- Mock modes are documented but still need first-class implementation in the Paystack, Resend, and Stellar service layers.
- The project still has transitional EVM/Lisk/Solana dependencies and assumptions.
- `KYC_DOCUMENT_ENCRYPTION_KEY` is optional and falls back to existing auth/session secrets. A dedicated secret should be added for production.
- Current GitHub secrets include legacy chain/deployment values that are not used by the current app and should not be exposed to generic CI.

## Environment variable audit

### Used in current code

| Variable | Current usage | Scope | Notes |
| --- | --- | --- | --- |
| `MONGODB_URI` | MongoDB connection | Server only | Required for app routes that touch database. |
| `JWT_SECRET` | Session signing and KYC encryption fallback | Server only | Required. Prefer a separate KYC secret in production. |
| `AUTH_SESSION_SECRET` | Optional session signing fallback | Server only | Used as fallback but not listed in original secret list. |
| `NEXT_PUBLIC_APP_URL` | Paystack callback URL | Public-safe | Can be used client-side because it is public. |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy provider and server audience fallback | Public-safe | Correctly used in client provider. |
| `PRIVY_APP_ID` | Optional server-side Privy App ID | Server only | Not currently in your GitHub secret list; can be derived from public app ID. |
| `PRIVY_APP_SECRET` | Server-side Privy API profile fetch and session fallback | Server only | Keep off client. |
| `PRIVY_JWKS_URL` | Privy JWT verification | Server only | Required for server token verification unless derivable from app ID. |
| `PAYSTACK_SECRET_KEY` | Transaction initialization, verification, webhook HMAC, DVA provisioning | Server only | Never expose in frontend. |
| `PAYSTACK_DVA_PREFERRED_BANK` | Dedicated virtual account bank selection | Server only | Not in your latest secret list; optional, defaults to `test-bank` for test keys. |
| `RESEND_API_KEY` | KYC notifications and admin email route | Server only | Mock this for contributors. |
| `KYC_DOCUMENT_ENCRYPTION_KEY` | KYC document encryption | Server only | Optional in code, recommended as dedicated production secret. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob SDK runtime credential | Server only | Required when upload route is exercised outside Vercel-managed environments. |
| `NODE_ENV` | Cookie secure behavior and framework mode | Runtime | Standard environment value. |

### Added in GitHub secrets but not currently used by the app

These should be treated as future, legacy, or maintainer-only unless code is added that needs them:

- `ACCOUNT_FACTORY_ADDRESS`
- `ALGORITHM`
- `CHAINMOVE_CA`
- `PAYSTACK_PUBLIC_KEY`
- `RPC_URL`
- `SECRET_KEY_HEX`
- `THIRDWEB_CLIENT_ID`
- `THIRDWEB_SECRET_KEY`
- `TREASURY_ADDRESS`
- `TREASURY_PK_KEY`

Recommendation: do not pass these into contributor PR CI. If needed later, use them only in protected maintainer workflows.

### Planned Stellar variables not yet in your latest secret list

Add these when the Stellar integration lands:

- `STELLAR_NETWORK`
- `STELLAR_HORIZON_URL`
- `STELLAR_RPC_URL`
- `STELLAR_ASSET_CODE`
- `STELLAR_ISSUER_PUBLIC_KEY`
- `STELLAR_DISTRIBUTION_PUBLIC_KEY`
- `STELLAR_CONTRACT_ID`

For now, CI uses mock/testnet placeholders for PR checks and can map `RPC_URL` to `STELLAR_RPC_URL` on trusted main checks.

## Mock service implementation plan

### Paystack checkout mock

Create a small helper such as `lib/services/paystack-mock.service.ts`:

```ts
export function isMockPaymentsEnabled() {
  return process.env.ENABLE_MOCK_PAYMENTS === "true"
}

export function createMockPaystackInitialization(input: {
  amountNgn: number
  email: string
  reference: string
}) {
  return {
    status: true,
    message: "Mock Paystack transaction initialized.",
    data: {
      authorization_url: `/dashboard/investor?mock_payment_reference=${input.reference}`,
      access_code: `mock_${input.reference}`,
      reference: input.reference,
    },
  }
}
```

Use this in:

- `app/api/payments/initialize/route.ts`
- `app/api/payments/down-payment/route.ts`
- `app/api/driver/payments/initialize/route.ts`
- `app/api/payments/verify/route.ts`

Acceptance behavior: when `ENABLE_MOCK_PAYMENTS=true`, routes should return deterministic mock responses without calling Paystack.

### Paystack DVA mock

In `lib/services/paystack-dva.service.ts` and `lib/services/paystack-investor-dva.service.ts`, short-circuit provisioning when mock payments are enabled and return a stable local virtual account snapshot.

Example account format:

- bank name: `Mock Bank`
- provider slug: `test-bank`
- account number: deterministic from user ID or contract ID
- status: `ACTIVE`

### Resend mock

Create a helper such as `lib/services/email.service.ts`:

```ts
export async function sendEmail(input: { to: string | string[]; subject: string; html: string }) {
  if (process.env.ENABLE_MOCK_EMAILS === "true") {
    console.info("MOCK_EMAIL_SEND", {
      recipients: Array.isArray(input.to) ? input.to.length : 1,
      subject: input.subject,
    })
    return { id: `mock_email_${Date.now()}` }
  }

  // call Resend when mock mode is disabled
}
```

Use it in server actions and email routes so contributors do not need a Resend credential.

### Stellar mock

Create `lib/stellar/config.ts` and `lib/stellar/client.ts` with mock-first behavior:

```ts
export function getStellarConfig() {
  return {
    network: process.env.STELLAR_NETWORK || "testnet",
    horizonUrl: process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
    rpcUrl: process.env.STELLAR_RPC_URL || process.env.RPC_URL || "https://soroban-testnet.stellar.org",
    assetCode: process.env.STELLAR_ASSET_CODE || "CMOVE",
    issuerPublicKey: process.env.STELLAR_ISSUER_PUBLIC_KEY || "",
    distributionPublicKey: process.env.STELLAR_DISTRIBUTION_PUBLIC_KEY || "",
    contractId: process.env.STELLAR_CONTRACT_ID || process.env.CHAINMOVE_CA || "",
    mock: process.env.ENABLE_MOCK_STELLAR === "true",
  }
}
```

Never store or expose signing material in frontend code.

## Privy signup flow review

Current flow:

- `app/Providers.tsx` uses `NEXT_PUBLIC_PRIVY_APP_ID` in a client provider.
- `app/api/auth/privy/sync/route.ts` verifies Privy tokens server-side, creates/syncs users, accepts driver/investor roles, stores email, phone number, Privy user ID, and wallet address.
- `models/User.ts` stores `privyUserId`, `walletAddress`, `walletaddress`, and role.

Recommended improvements:

1. Keep Privy as the auth layer.
2. Add Stellar-specific fields to `User`:
   - `stellarPublicKey`
   - `stellarAccountType`
   - `stellarLinkedAt`
   - `stellarLastSyncedAt`
3. Keep EVM wallet fields only as legacy/transition fields.
4. Add a profile sync test for role selection, email conflict handling, and wallet conflict handling.
5. Add contributor docs explaining that Privy sandbox credentials or mock auth should be used locally.
6. Add future account-linking route: `POST /api/auth/stellar/link` to connect a Privy-authenticated user to a Stellar public account.

## Stellar integration roadmap

### Milestone 1: Clean chain configuration

- Inventory EVM/Lisk/Solana/Thirdweb references.
- Keep only what is still required for current Privy embedded wallet flows.
- Create `lib/stellar/config.ts`.
- Document Stellar Testnet defaults.

### Milestone 2: Stellar SDK setup

- Add Stellar SDK utilities.
- Configure Horizon and RPC clients.
- Add testnet/mainnet switching.
- Add mock client support.

### Milestone 3: Privy + Stellar user linking

- Add Stellar public account fields to `User`.
- Add user-facing Stellar account link flow.
- Store public identifiers only.
- Add server-side verification for account ownership when required.

### Milestone 4: Vehicle pool asset model

- Define CMOVE pool asset naming rules.
- Define issuer and distribution account strategy.
- Define asset metadata and `stellar.toml` requirements.
- Map vehicle pool shares to Stellar assets or Soroban records.

### Milestone 5: Soroban contracts

Create interfaces for:

- pool ownership
- driver repayment tracking
- investor payout rules
- treasury actions
- governance actions

### Milestone 6: Event indexing

- Index Stellar payments and contract events into MongoDB.
- Store idempotency keys for each ledger event.
- Map onchain events to investor and driver dashboards.

### Milestone 7: Product integration

Connect Stellar data to:

- investor ownership view
- repayment receipts
- payout records
- admin reports
- governance screens

### Milestone 8: Testing and documentation

- Add tests for Stellar config and mock mode.
- Add testnet walkthroughs.
- Add architecture docs.
- Add contributor examples.

## Recommended GitHub labels

- `grantfox`
- `good first issue`
- `beginner`
- `intermediate`
- `advanced`
- `stellar`
- `soroban`
- `security`
- `documentation`
- `testing`
- `ui/ux`
- `auth`
- `payments`
- `ci`
- `backend`
- `frontend`
- `needs triage`
- `blocked`
- `mock-mode`

## First 10 GrantFox-ready issues

### 1. Add `.env.example` with safe placeholders

Problem: Contributors need a safe local env template without maintainer credentials.

Expected solution: Add `.env.example`, update `.gitignore`, and document mock mode.

Files likely involved: `.env.example`, `.gitignore`, `README.md`.

Acceptance criteria:

- `.env.example` contains placeholders only.
- `.env.local` remains ignored.
- Mock flags are included.
- No production credentials are present.

Labels: `grantfox`, `good first issue`, `documentation`, `security`.

Difficulty: Good first issue.

### 2. Add GitHub Actions CI using safe contributor checks

Problem: PRs need standard lint/type/build checks without exposing secrets.

Expected solution: Add `.github/workflows/ci.yml` with mock env for PRs and trusted checks for main.

Files likely involved: `.github/workflows/ci.yml`, `package.json`.

Acceptance criteria:

- Runs on PRs and pushes to main.
- Runs `npm ci`, lint, TypeScript check, and build.
- PR job uses mock values.
- No deployment step runs on PRs.

Labels: `grantfox`, `ci`, `security`, `beginner`.

Difficulty: Beginner.

### 3. Add contributor and security docs

Problem: Contributors need clear rules for secrets, mock mode, and PR expectations.

Expected solution: Add `CONTRIBUTING.md` and `SECURITY.md`.

Files likely involved: `CONTRIBUTING.md`, `SECURITY.md`.

Acceptance criteria:

- Docs explain `.env.example` setup.
- Docs explain mock mode.
- Docs explain server-only env variables.
- Security policy explains private reporting.

Labels: `grantfox`, `documentation`, `security`, `good first issue`.

Difficulty: Good first issue.

### 4. Add mock Paystack checkout mode

Problem: Contributors cannot test payment initialization without Paystack credentials.

Expected solution: Add a mock helper and wire it into payment initialization routes.

Files likely involved: `app/api/payments/initialize/route.ts`, `app/api/payments/down-payment/route.ts`, `app/api/driver/payments/initialize/route.ts`, `lib/services/paystack-mock.service.ts`.

Acceptance criteria:

- `ENABLE_MOCK_PAYMENTS=true` returns fake successful initialization responses.
- Real Paystack is not called in mock mode.
- Existing validation still runs.

Labels: `grantfox`, `payments`, `mock-mode`, `intermediate`.

Difficulty: Intermediate.

### 5. Add mock Paystack DVA repayment flow

Problem: Contributors cannot test dedicated virtual account workflows without Paystack DVA access.

Expected solution: Return deterministic mock virtual account snapshots when mock payments are enabled.

Files likely involved: `lib/services/paystack-dva.service.ts`, `lib/services/paystack-investor-dva.service.ts`, virtual account models.

Acceptance criteria:

- Driver DVA can be provisioned in mock mode.
- Investor DVA can be provisioned in mock mode.
- Webhook/verification docs explain local mock behavior.

Labels: `grantfox`, `payments`, `mock-mode`, `intermediate`.

Difficulty: Intermediate.

### 6. Add mock Resend mode

Problem: Contributors cannot test email features without Resend credentials.

Expected solution: Create email service wrapper and mock send behavior.

Files likely involved: `app/api/send-email/route.ts`, `actions/user.ts`, `lib/services/email.service.ts`.

Acceptance criteria:

- `ENABLE_MOCK_EMAILS=true` avoids Resend calls.
- Mock result is returned/logged safely.
- Existing email validation remains intact.

Labels: `grantfox`, `backend`, `mock-mode`, `beginner`.

Difficulty: Beginner.

### 7. Add Stellar config helper

Problem: Stellar config should be centralized before SDK integration.

Expected solution: Create config helpers for Horizon, RPC, network, asset code, issuer, distribution account, and contract ID.

Files likely involved: `lib/stellar/config.ts`, `.env.example`, docs.

Acceptance criteria:

- Defaults target Stellar Testnet.
- `STELLAR_RPC_URL` can fall back to `RPC_URL` during transition.
- Mock mode is supported.

Labels: `grantfox`, `stellar`, `backend`, `beginner`.

Difficulty: Beginner.

### 8. Add Stellar account fields to user model

Problem: User records need Stellar account linkage without replacing Privy auth.

Expected solution: Add optional Stellar public account fields to `models/User.ts` and update sync docs.

Files likely involved: `models/User.ts`, auth docs, future migration notes.

Acceptance criteria:

- User model includes optional Stellar public account fields.
- No sensitive signing material is stored.
- Existing Privy flow remains compatible.

Labels: `grantfox`, `stellar`, `auth`, `backend`, `intermediate`.

Difficulty: Intermediate.

### 9. Replace old wallet assumptions with Stellar-ready abstraction

Problem: Current provider config still has Lisk/EVM assumptions from the temporary wallet layer.

Expected solution: Isolate current Privy wallet config and prepare a chain-agnostic interface for future Stellar account linking.

Files likely involved: `app/Providers.tsx`, `lib/stellar/*`, auth docs.

Acceptance criteria:

- Legacy chain assumptions are clearly isolated.
- New code does not hardcode Lisk/EVM for Stellar features.
- Privy remains the auth layer.

Labels: `grantfox`, `stellar`, `auth`, `frontend`, `advanced`.

Difficulty: Advanced.

### 10. Improve Privy signup and user sync docs

Problem: Contributors need to understand how Privy auth maps to ChainMove users and roles.

Expected solution: Document signup sync, role selection, wallet capture, session cookie, and future Stellar linking.

Files likely involved: `docs/auth.md`, `README.md`, `app/api/auth/privy/sync/route.ts` comments if needed.

Acceptance criteria:

- Docs explain driver/investor role selection.
- Docs explain server-side token verification.
- Docs explain future Stellar linking without removing Privy.

Labels: `grantfox`, `documentation`, `auth`, `stellar`, `beginner`.

Difficulty: Beginner.

## Maintainer next steps

1. Review and merge the contributor safety PR.
2. Add missing optional repository secrets when needed: `PAYSTACK_DVA_PREFERRED_BANK`, `KYC_DOCUMENT_ENCRYPTION_KEY`, and planned Stellar variables.
3. Keep maintainer-only chain/deployment credentials out of contributor PR workflows.
4. Post the first 10 issues above to GrantFox.
5. Prioritize mock Paystack and mock Resend before inviting many contributors.
6. Prioritize Stellar config helper before deeper Soroban work.

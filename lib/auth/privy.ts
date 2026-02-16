import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose"

const PRIVY_ISSUERS = ["privy.io", "https://auth.privy.io", "https://auth.privy.io/"]

type RawLinkedAccount = {
  type?: string
  address?: string
  email?: string
  phoneNumber?: string
  phone_number?: string
}

export interface PrivyIdentityPayload extends JWTPayload {
  sub: string
  email?: string
  phone_number?: string
  linked_accounts?: RawLinkedAccount[] | string
}

export interface ParsedPrivyProfile {
  privyUserId: string
  email?: string
  phoneNumber?: string
  walletAddress?: string
}

function getPrivyAppId() {
  const configuredId = process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID
  if (configuredId) return configuredId

  const jwksUrl = process.env.PRIVY_JWKS_URL
  if (!jwksUrl) return null

  const match = jwksUrl.match(/\/apps\/([^/]+)\/jwks\.json$/)
  return match?.[1] ?? null
}

function getPrivyJwksUrl() {
  if (process.env.PRIVY_JWKS_URL) return process.env.PRIVY_JWKS_URL
  const appId = getPrivyAppId()
  if (!appId) {
    throw new Error("Missing PRIVY_JWKS_URL and Privy App ID (PRIVY_APP_ID or NEXT_PUBLIC_PRIVY_APP_ID)")
  }

  return `https://auth.privy.io/api/v1/apps/${appId}/jwks.json`
}

function getPrivyAudience() {
  const appId = getPrivyAppId()
  if (!appId) throw new Error("Privy App ID is required (PRIVY_APP_ID or NEXT_PUBLIC_PRIVY_APP_ID)")
  return appId
}

const privyJwks = createRemoteJWKSet(new URL(getPrivyJwksUrl()))

function readBearerToken(headerValue: string | null): string | null {
  if (!headerValue) return null
  const [scheme, token] = headerValue.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) return null
  return token
}

export function extractPrivyTokenFromRequest(request: Request) {
  return (
    request.headers.get("privy-id-token") ||
    request.headers.get("x-privy-token") ||
    readBearerToken(request.headers.get("authorization"))
  )
}

export async function verifyPrivyToken(token: string) {
  const { payload } = await jwtVerify(token, privyJwks, {
    issuer: PRIVY_ISSUERS,
    audience: getPrivyAudience(),
  })

  return payload as PrivyIdentityPayload
}

function parseLinkedAccounts(linkedAccounts: PrivyIdentityPayload["linked_accounts"]) {
  if (!linkedAccounts) return [] as RawLinkedAccount[]
  if (Array.isArray(linkedAccounts)) return linkedAccounts

  if (typeof linkedAccounts === "string") {
    try {
      const parsed = JSON.parse(linkedAccounts)
      return Array.isArray(parsed) ? (parsed as RawLinkedAccount[]) : []
    } catch {
      return []
    }
  }

  return []
}

export function getPrivyProfileFromPayload(payload: PrivyIdentityPayload): ParsedPrivyProfile {
  const linkedAccounts = parseLinkedAccounts(payload.linked_accounts)

  const walletAccount = linkedAccounts.find((account) => account.type === "wallet" && typeof account.address === "string")
  const emailAccount = linkedAccounts.find((account) => account.type === "email" && typeof account.email === "string")
  const phoneAccount = linkedAccounts.find(
    (account) =>
      account.type === "phone" && (typeof account.phoneNumber === "string" || typeof account.phone_number === "string"),
  )

  return {
    privyUserId: payload.sub,
    email: payload.email || emailAccount?.email,
    phoneNumber: payload.phone_number || phoneAccount?.phoneNumber || phoneAccount?.phone_number,
    walletAddress: walletAccount?.address?.toLowerCase(),
  }
}

const TOKEN_RETRY_ATTEMPTS = 40
const TOKEN_RETRY_DELAY_MS = 500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type AccessTokenResolver = () => Promise<string | null>

function normalizeToken(token: string | null | undefined) {
  if (typeof token !== "string") return null
  const trimmed = token.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function resolvePrivyAccessToken(
  getAccessToken?: AccessTokenResolver,
  existingToken?: string | null,
) {
  const initialToken = normalizeToken(existingToken)
  if (initialToken) return initialToken
  if (!getAccessToken) return null

  for (let attempt = 0; attempt < TOKEN_RETRY_ATTEMPTS; attempt += 1) {
    const token = normalizeToken(await getAccessToken().catch(() => null))
    if (token) return token
    await sleep(TOKEN_RETRY_DELAY_MS)
  }

  return null
}

export const resolvePrivyIdentityToken = resolvePrivyAccessToken

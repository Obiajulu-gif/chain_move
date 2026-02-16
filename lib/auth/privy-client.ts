import { getIdentityToken } from "@privy-io/react-auth"

const TOKEN_RETRY_ATTEMPTS = 12
const TOKEN_RETRY_DELAY_MS = 250

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function resolvePrivyIdentityToken(existingToken?: string | null) {
  if (existingToken) return existingToken

  for (let attempt = 0; attempt < TOKEN_RETRY_ATTEMPTS; attempt += 1) {
    const token = await getIdentityToken().catch(() => null)
    if (token) return token
    await sleep(TOKEN_RETRY_DELAY_MS)
  }

  return null
}

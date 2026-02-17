import type { FundWalletConfig, UseFundWalletInterface } from "@privy-io/react-auth"

type FundableWallet = {
  linked?: boolean
  loginOrLink?: () => Promise<void>
  fund?: (options?: FundWalletConfig) => Promise<void>
}

interface StartPrivyFundingParams {
  walletAddress: string
  embeddedWallet?: FundableWallet | null
  fundWallet: UseFundWalletInterface["fundWallet"]
  options?: FundWalletConfig
}

const DEFAULT_FUNDING_ERROR =
  "Use Open wallet / receive or fund your internal wallet via Paystack."

export async function startPrivyFunding({
  walletAddress,
  embeddedWallet,
  fundWallet,
  options,
}: StartPrivyFundingParams) {
  if (embeddedWallet?.linked === false && typeof embeddedWallet.loginOrLink === "function") {
    await embeddedWallet.loginOrLink()
  }

  let embeddedFundingError: unknown = null

  if (typeof embeddedWallet?.fund === "function") {
    try {
      await embeddedWallet.fund(options)
      return
    } catch (error) {
      embeddedFundingError = error
    }
  }

  try {
    return await fundWallet({ address: walletAddress, options })
  } catch (fallbackError) {
    throw fallbackError ?? embeddedFundingError ?? new Error(DEFAULT_FUNDING_ERROR)
  }
}

export function getPrivyFundingErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const maybeError = error as { message?: string; privyErrorCode?: string; code?: string }
    const privyErrorCode = (maybeError.privyErrorCode || maybeError.code || "").toLowerCase()
    const message = typeof maybeError.message === "string" ? maybeError.message.trim() : ""

    if (/wallet funding is not enabled/i.test(message)) {
      return "Privy funding is disabled for this app. Enable at least one funding method in Privy Dashboard > Account Funding. Card funding is mainnet-only."
    }

    if (privyErrorCode === "unsupported_chain_id" || /unsupported chain/i.test(message)) {
      return "Privy funding is not supported on the selected chain yet. Use Open wallet / receive or Paystack funding."
    }

    if (privyErrorCode === "not_supported" || /not supported/i.test(message)) {
      return "Privy funding is not enabled for this flow. Use Open wallet / receive or Paystack funding."
    }

    if (message) return message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  return DEFAULT_FUNDING_ERROR
}

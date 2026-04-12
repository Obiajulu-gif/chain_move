import { NextResponse } from "next/server"

import { finalizeAuthenticatedResponse, requireAuthenticatedUser } from "@/lib/api/route-guard"
import {
  getOrProvisionInvestorVirtualAccount,
  InvestorVirtualAccountProvisionError,
} from "@/lib/services/paystack-investor-dva.service"

export async function GET(request: Request) {
  try {
    const authContext = await requireAuthenticatedUser(request, ["investor"], {
      forbiddenMessage: "Only investors can access dedicated funding accounts.",
    })
    if ("response" in authContext) return authContext.response

    const virtualAccount = await getOrProvisionInvestorVirtualAccount({
      investorUserId: authContext.user._id.toString(),
    })

    const response = NextResponse.json({
      success: true,
      data: {
        accountNumber: virtualAccount.accountNumber,
        accountName: virtualAccount.accountName,
        bankName: virtualAccount.bankName,
        providerSlug: virtualAccount.providerSlug,
        status: virtualAccount.status,
        internalBalanceNgn: Number(authContext.user.availableBalance || 0),
      },
    })

    return finalizeAuthenticatedResponse(response, authContext)
  } catch (error) {
    const message =
      error instanceof InvestorVirtualAccountProvisionError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unable to load investor virtual account."
    const statusCode = error instanceof InvestorVirtualAccountProvisionError ? error.statusCode : 500
    const code =
      error instanceof InvestorVirtualAccountProvisionError
        ? error.code
        : "INVESTOR_VIRTUAL_ACCOUNT_ERROR"

    return NextResponse.json(
      {
        success: false,
        code,
        message,
      },
      { status: statusCode },
    )
  }
}

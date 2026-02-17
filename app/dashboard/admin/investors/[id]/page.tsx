import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import dbConnect from "@/lib/dbConnect"
import Investment from "@/models/Investment"
import InvestmentPool from "@/models/InvestmentPool"
import InvestorCredit from "@/models/InvestorCredit"
import PoolInvestment from "@/models/PoolInvestment"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import Vehicle from "@/models/Vehicle"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface InvestorDetailsPageProps {
  params: Promise<{ id: string }>
}

function displayName(user: any) {
  return user.fullName || user.name || user.email || "Unnamed investor"
}

export default async function InvestorDetailsPage({ params }: InvestorDetailsPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const { id } = await params
  const investor = await User.findOne({ _id: id, role: "investor" })
    .select("name fullName email phoneNumber privyUserId walletAddress walletaddress createdAt")
    .lean()

  if (!investor) {
    notFound()
  }

  const [deposits, poolInvestments, legacyInvestments, credits] = await Promise.all([
    Transaction.find({
      userId: investor._id,
      type: { $in: ["deposit", "wallet_funding"] },
      status: { $in: ["Completed", "completed", "SUCCESS", "success", "Successful", "successful"] },
    })
      .select("amount method status gatewayReference timestamp")
      .sort({ timestamp: -1 })
      .limit(20)
      .lean(),
    PoolInvestment.find({ userId: investor._id, status: "CONFIRMED" })
      .select("poolId amountNgn ownershipBps txRef createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Investment.find({ investorId: investor._id, status: { $in: ["Active", "Completed"] } })
      .select("vehicleId amount status monthlyReturn date")
      .sort({ date: -1 })
      .limit(20)
      .lean(),
    InvestorCredit.find({ investorUserId: investor._id })
      .select("poolId amountNgn ownershipBps status createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ])

  const poolIds = Array.from(new Set([...poolInvestments.map((item: any) => item.poolId?.toString()), ...credits.map((item: any) => item.poolId?.toString())].filter(Boolean)))
  const pools = poolIds.length ? await InvestmentPool.find({ _id: { $in: poolIds } }).select("assetType status").lean() : []
  const poolById = new Map(pools.map((pool: any) => [pool._id.toString(), pool]))

  const vehicleIds = Array.from(new Set(legacyInvestments.map((item: any) => item.vehicleId?.toString()).filter(Boolean)))
  const vehicles = vehicleIds.length ? await Vehicle.find({ _id: { $in: vehicleIds } }).select("name type").lean() : []
  const vehicleById = new Map(vehicles.map((vehicle: any) => [vehicle._id.toString(), vehicle]))

  const totalDeposits = deposits.reduce((sum, item: any) => sum + Number(item.amount || 0), 0)
  const totalInvested =
    poolInvestments.reduce((sum, item: any) => sum + Number(item.amountNgn || 0), 0) +
    legacyInvestments.reduce((sum, item: any) => sum + Number(item.amount || 0), 0)
  const totalCredits = credits.reduce((sum, item: any) => sum + Number(item.amountNgn || 0), 0)

  const walletAddress = investor.walletAddress || investor.walletaddress || "Not linked"

  return (
    <div className="space-y-5">
      <PageHeader
        title={displayName(investor)}
        subtitle="Investor profile, deposits, investments, and payout credits."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/investors">Back to Investors</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="border-border/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {investor.email || "N/A"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {investor.phoneNumber || "N/A"}</p>
            <p className="break-all"><span className="text-muted-foreground">Privy ID:</span> {investor.privyUserId || "Not linked"}</p>
            <p className="break-all"><span className="text-muted-foreground">Wallet:</span> {walletAddress}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Deposits:</span> {formatNaira(totalDeposits)}</p>
            <p><span className="text-muted-foreground">Invested:</span> {formatNaira(totalInvested)}</p>
            <p><span className="text-muted-foreground">Credits/Payouts:</span> {formatNaira(totalCredits)}</p>
            <p><span className="text-muted-foreground">Joined:</span> {new Date(investor.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Notes / Flags</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No manual flags are recorded for this investor yet.
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Deposits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {deposits.length === 0 ? (
              <p className="text-muted-foreground">No deposits recorded.</p>
            ) : (
              deposits.map((deposit: any) => (
                <div key={deposit._id.toString()} className="rounded-lg border border-border/70 p-3">
                  <p className="font-medium">{formatNaira(deposit.amount)}</p>
                  <p className="text-muted-foreground">Method: {deposit.method || "unknown"}</p>
                  <p className="text-muted-foreground">Status: {deposit.status}</p>
                  <p className="text-muted-foreground">{new Date(deposit.timestamp).toLocaleString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Investments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {poolInvestments.length === 0 && legacyInvestments.length === 0 ? (
              <p className="text-muted-foreground">No investments recorded.</p>
            ) : (
              <>
                {poolInvestments.map((investment: any) => {
                  const pool = poolById.get(investment.poolId?.toString())
                  return (
                    <div key={`pool-${investment._id.toString()}`} className="rounded-lg border border-border/70 p-3">
                      <p className="font-medium">{formatNaira(investment.amountNgn)}</p>
                      <p className="text-muted-foreground">
                        Pool: {pool ? `${pool.assetType} (${pool.status})` : "Pool"}
                      </p>
                      <p className="text-muted-foreground">Ownership: {(Number(investment.ownershipBps || 0) / 100).toFixed(2)}%</p>
                      <p className="text-muted-foreground">{new Date(investment.createdAt).toLocaleString()}</p>
                    </div>
                  )
                })}
                {legacyInvestments.map((investment: any) => {
                  const vehicle = vehicleById.get(investment.vehicleId?.toString())
                  return (
                    <div key={`legacy-${investment._id.toString()}`} className="rounded-lg border border-border/70 p-3">
                      <p className="font-medium">{formatNaira(investment.amount)}</p>
                      <p className="text-muted-foreground">Asset: {vehicle?.name || vehicle?.type || "Vehicle"}</p>
                      <p className="text-muted-foreground">Status: {investment.status}</p>
                      <p className="text-muted-foreground">{new Date(investment.date).toLocaleString()}</p>
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Payouts / Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {credits.length === 0 ? (
              <p className="text-muted-foreground">No payout credits recorded.</p>
            ) : (
              credits.map((credit: any) => {
                const pool = poolById.get(credit.poolId?.toString())
                return (
                  <div key={credit._id.toString()} className="rounded-lg border border-border/70 p-3">
                    <p className="font-medium">{formatNaira(credit.amountNgn)}</p>
                    <p className="text-muted-foreground">
                      Pool: {pool ? `${pool.assetType} (${pool.status})` : "Pool"}
                    </p>
                    <p className="text-muted-foreground">Ownership snapshot: {(Number(credit.ownershipBps || 0) / 100).toFixed(2)}%</p>
                    <p className="text-muted-foreground">
                      <Badge variant="secondary">{credit.status}</Badge>
                    </p>
                    <p className="text-muted-foreground">{new Date(credit.createdAt).toLocaleString()}</p>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


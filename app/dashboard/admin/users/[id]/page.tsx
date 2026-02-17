import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import dbConnect from "@/lib/dbConnect"
import Investment from "@/models/Investment"
import PoolInvestment from "@/models/PoolInvestment"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface UserDetailsPageProps {
  params: Promise<{ id: string }>
}

function getDisplayName(user: any) {
  return user.fullName || user.name || user.email || "Unnamed user"
}

export default async function AdminUserDetailsPage({ params }: UserDetailsPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const { id } = await params
  const user = await User.findById(id)
    .select("name fullName email phoneNumber role walletAddress walletaddress privyUserId createdAt")
    .lean()

  if (!user) {
    notFound()
  }

  const [depositsTotal, returnsTotal, poolInvestmentTotal, legacyInvestmentTotal] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: { $in: ["deposit", "wallet_funding"] },
          status: { $in: ["Completed", "completed", "SUCCESS", "success", "Successful", "successful"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: "return",
          status: { $in: ["Completed", "completed", "SUCCESS", "success", "Successful", "successful"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    PoolInvestment.aggregate([
      { $match: { userId: user._id, status: "CONFIRMED" } },
      { $group: { _id: null, total: { $sum: "$amountNgn" } } },
    ]),
    Investment.aggregate([
      { $match: { investorId: user._id, status: { $in: ["Active", "Completed"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ])

  const totalDeposits = Number(depositsTotal[0]?.total || 0)
  const totalReturns = Number(returnsTotal[0]?.total || 0)
  const totalInvested = Number(poolInvestmentTotal[0]?.total || 0) + Number(legacyInvestmentTotal[0]?.total || 0)
  const walletAddress = user.walletAddress || user.walletaddress || "Not linked"

  return (
    <div className="space-y-5">
      <PageHeader
        title={getDisplayName(user)}
        subtitle="User profile and financial summary."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/users">Back to Users</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {user.email || "N/A"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {user.phoneNumber || "N/A"}</p>
            <p>
              <span className="text-muted-foreground">Role:</span>{" "}
              <Badge variant="secondary" className="capitalize">{user.role || "unknown"}</Badge>
            </p>
            <p><span className="text-muted-foreground">Joined:</span> {new Date(user.createdAt).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="break-all"><span className="text-muted-foreground">Privy ID:</span> {user.privyUserId || "Not linked"}</p>
            <p className="break-all"><span className="text-muted-foreground">Wallet:</span> {walletAddress}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Total Deposits:</span> {formatNaira(totalDeposits)}</p>
            <p><span className="text-muted-foreground">Total Invested:</span> {formatNaira(totalInvested)}</p>
            <p><span className="text-muted-foreground">Total Returns:</span> {formatNaira(totalReturns)}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


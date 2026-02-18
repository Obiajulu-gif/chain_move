import Link from "next/link"
import { Eye, Search } from "lucide-react"
import mongoose from "mongoose"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatNaira } from "@/lib/currency"
import { cn } from "@/lib/utils"
import dbConnect from "@/lib/dbConnect"
import Investment from "@/models/Investment"
import PoolInvestment from "@/models/PoolInvestment"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface InvestorsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const PAGE_SIZE = 20

function getParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback
  return value ?? fallback
}

function toInt(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

function buildInvestorsHref({
  page,
  q,
}: {
  page: number
  q: string
}) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (q) params.set("q", q)
  const query = params.toString()
  return query ? `/dashboard/admin/investors?${query}` : "/dashboard/admin/investors"
}

function displayName(user: any) {
  return user.fullName || user.name || user.email || "Unnamed investor"
}

export default async function AdminInvestorsPage({ searchParams }: InvestorsPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const resolvedSearchParams = (await searchParams) || {}
  const q = getParam(resolvedSearchParams.q).trim()
  const page = toInt(getParam(resolvedSearchParams.page, "1"), 1)

  const query: Record<string, unknown> = { role: "investor" }
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    query.$or = [{ name: regex }, { fullName: regex }, { email: regex }, { privyUserId: regex }]
  }

  const totalCount = await User.countDocuments(query)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const investors = await User.find(query)
    .select("name fullName email privyUserId walletAddress walletaddress createdAt")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean()

  const investorIds = investors.map((investor: any) => new mongoose.Types.ObjectId(investor._id))

  const [depositAgg, poolInvestAgg, legacyInvestAgg] = investorIds.length
    ? await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: { $in: investorIds },
            type: { $in: ["deposit", "wallet_funding"] },
            status: { $in: ["Completed", "completed", "SUCCESS", "success", "Successful", "successful"] },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalDeposited: { $sum: "$amount" },
          },
        },
      ]),
      PoolInvestment.aggregate([
        { $match: { userId: { $in: investorIds }, status: "CONFIRMED" } },
        {
          $group: {
            _id: "$userId",
            totalInvested: { $sum: "$amountNgn" },
            activePools: { $addToSet: "$poolId" },
          },
        },
      ]),
      Investment.aggregate([
        { $match: { investorId: { $in: investorIds }, status: { $in: ["Active", "Completed"] } } },
        {
          $group: {
            _id: "$investorId",
            totalInvested: { $sum: "$amount" },
          },
        },
      ]),
    ])
    : [[], [], []]

  const depositByUser = new Map<string, number>()
  for (const row of depositAgg) {
    depositByUser.set(row._id.toString(), Number(row.totalDeposited || 0))
  }

  const poolInvestByUser = new Map<string, { invested: number; activePools: number }>()
  for (const row of poolInvestAgg) {
    poolInvestByUser.set(row._id.toString(), {
      invested: Number(row.totalInvested || 0),
      activePools: Array.isArray(row.activePools) ? row.activePools.length : 0,
    })
  }

  const legacyInvestByUser = new Map<string, number>()
  for (const row of legacyInvestAgg) {
    legacyInvestByUser.set(row._id.toString(), Number(row.totalInvested || 0))
  }

  const from = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, totalCount)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Investors"
        subtitle="Registered investors and portfolio footprint."
        actions={
          <form action="/dashboard/admin/investors" className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-[220px] flex-1 sm:w-[280px] sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search investor, email, Privy ID"
                className="h-9 pl-9"
              />
            </div>
            <Button type="submit" variant="outline" className="h-9">
              Search
            </Button>
          </form>
        }
      />

      <section className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-sm text-muted-foreground">
          <p>
            Showing {from} to {to} of {totalCount} investors
          </p>
          <p>Page {currentPage} of {totalPages}</p>
        </div>

        <div className="divide-y divide-border/60 md:hidden">
          {investors.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No investors found.</div>
          ) : (
            investors.map((investor: any) => {
              const id = investor._id.toString()
              const deposited = depositByUser.get(id) || 0
              const pooled = poolInvestByUser.get(id)
              const invested = (pooled?.invested || 0) + (legacyInvestByUser.get(id) || 0)
              const walletAddress = investor.walletAddress || investor.walletaddress || "Not linked"

              return (
                <article key={id} className="space-y-3 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{displayName(investor)}</p>
                      <p className="text-xs text-muted-foreground">{investor.email || "No email"}</p>
                    </div>
                    <Badge variant="secondary">{pooled?.activePools || 0} pools</Badge>
                  </div>
                  <div className="grid gap-1 text-xs text-muted-foreground">
                    <p>Total deposited: {formatNaira(deposited)}</p>
                    <p>Total invested: {formatNaira(invested)}</p>
                    <p className="truncate">Wallet: {walletAddress}</p>
                    <p className="truncate">Privy: {investor.privyUserId || "Not linked"}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/dashboard/admin/investors/${id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View profile
                    </Link>
                  </Button>
                </article>
              )
            })
          )}
        </div>

        <div className="hidden max-h-[calc(100vh-280px)] overflow-auto md:block">
          <table className="w-full min-w-[1200px] border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Full Name</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Privy ID</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Wallet Address</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Total Deposited</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Total Invested</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Active Pools</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    No investors found.
                  </td>
                </tr>
              ) : (
                investors.map((investor: any) => {
                  const id = investor._id.toString()
                  const deposited = depositByUser.get(id) || 0
                  const pooled = poolInvestByUser.get(id)
                  const invested = (pooled?.invested || 0) + (legacyInvestByUser.get(id) || 0)
                  const walletAddress = investor.walletAddress || investor.walletaddress || "Not linked"

                  return (
                    <tr key={id} className="border-b border-border/60">
                      <td className="px-4 py-3 font-medium text-foreground">{displayName(investor)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{investor.email || "No email"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {investor.privyUserId ? (
                          <span className="truncate">{investor.privyUserId}</span>
                        ) : (
                          <Badge variant="secondary">Not linked</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{walletAddress}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatNaira(deposited)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatNaira(invested)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{pooled?.activePools || 0}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(investor.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm" className="h-8">
                          <Link href={`/dashboard/admin/investors/${id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View profile
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(currentPage <= 1 ? "pointer-events-none opacity-50" : "")}
          >
            <Link href={buildInvestorsHref({ page: Math.max(1, currentPage - 1), q })}>Previous</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(currentPage >= totalPages ? "pointer-events-none opacity-50" : "")}
          >
            <Link href={buildInvestorsHref({ page: Math.min(totalPages, currentPage + 1), q })}>Next</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { Eye, Search } from "lucide-react"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dbConnect from "@/lib/dbConnect"
import HirePurchaseContract from "@/models/HirePurchaseContract"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface DriversPageProps {
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

function buildDriversHref({
  page,
  q,
  kyc,
}: {
  page: number
  q: string
  kyc: string
}) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (q) params.set("q", q)
  if (kyc !== "all") params.set("kyc", kyc)
  const query = params.toString()
  return query ? `/dashboard/admin/drivers?${query}` : "/dashboard/admin/drivers"
}

function getDriverName(driver: any) {
  return driver.fullName || driver.name || driver.email || "Unnamed driver"
}

function getDriverRegion(driver: any) {
  const city = typeof driver.city === "string" ? driver.city : ""
  const region = typeof driver.region === "string" ? driver.region : typeof driver.state === "string" ? driver.state : ""
  if (city && region) return `${city}, ${region}`
  if (city) return city
  if (region) return region
  return "Not provided"
}

function normalizeKycStatus(driver: any) {
  if (driver.isKycVerified === true || driver.kycVerified === true) return "Approved"
  const raw = typeof driver.kycStatus === "string" ? driver.kycStatus.toLowerCase() : ""
  if (["approved", "approved_stage2", "verified", "complete", "completed"].includes(raw)) return "Approved"
  if (["rejected", "rejected_stage2"].includes(raw)) return "Rejected"
  return "Pending"
}

export default async function AdminDriversPage({ searchParams }: DriversPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const resolvedSearchParams = (await searchParams) || {}
  const q = getParam(resolvedSearchParams.q).trim()
  const kyc = getParam(resolvedSearchParams.kyc, "all")
  const page = toInt(getParam(resolvedSearchParams.page, "1"), 1)

  const baseQuery: Record<string, unknown> = { role: "driver" }

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    baseQuery.$or = [{ name: regex }, { fullName: regex }, { email: regex }, { phoneNumber: regex }]
  }

  if (kyc === "approved") {
    baseQuery.$or = [
      { isKycVerified: true },
      { kycVerified: true },
      { kycStatus: { $in: ["approved", "approved_stage2", "verified", "complete", "completed"] } },
    ]
  } else if (kyc === "pending") {
    baseQuery.$or = [
      { isKycVerified: { $ne: true } },
      { kycVerified: { $ne: true } },
      { kycStatus: { $in: [null, "", "pending", "pending_stage2", "none"] } },
    ]
  } else if (kyc === "rejected") {
    baseQuery.kycStatus = { $in: ["rejected", "rejected_stage2"] }
  }

  const totalCount = await User.countDocuments(baseQuery)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const drivers = await User.find(baseQuery)
    .select("name fullName email phoneNumber city region state kycStatus isKycVerified kycVerified createdAt")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean()

  const driverIds = drivers.map((driver: any) => driver._id)
  const contracts = driverIds.length
    ? await HirePurchaseContract.find({ driverUserId: { $in: driverIds } })
      .select("driverUserId vehicleDisplayName status createdAt")
      .sort({ createdAt: -1 })
      .lean()
    : []

  const latestContractByDriver = new Map<string, any>()
  for (const contract of contracts) {
    const driverId = contract.driverUserId?.toString?.()
    if (!driverId) continue
    if (!latestContractByDriver.has(driverId)) {
      latestContractByDriver.set(driverId, contract)
    }
  }

  const from = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, totalCount)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Drivers"
        subtitle="Registered drivers and verification status."
        actions={
          <form action="/dashboard/admin/drivers" className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-[220px] flex-1 sm:w-[280px] sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search name, email, phone"
                className="h-9 pl-9"
              />
            </div>
            <select
              name="kyc"
              defaultValue={kyc}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All KYC</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button type="submit" variant="outline" className="h-9">
              Apply
            </Button>
          </form>
        }
      />

      <section className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-sm text-muted-foreground">
          <p>
            Showing {from} to {to} of {totalCount} drivers
          </p>
          <p>Page {currentPage} of {totalPages}</p>
        </div>

        <div className="max-h-[calc(100vh-280px)] overflow-auto">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Full Name</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">City / Region</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">KYC Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Assigned Vehicle / Contract</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date Registered</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No drivers registered yet.
                  </td>
                </tr>
              ) : (
                drivers.map((driver: any) => {
                  const kycStatus = normalizeKycStatus(driver)
                  const contract = latestContractByDriver.get(driver._id.toString())
                  const contractLabel = contract ? `${contract.vehicleDisplayName} (${contract.status})` : "Not assigned"

                  return (
                    <tr key={driver._id.toString()} className="border-b border-border/60">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{getDriverName(driver)}</p>
                          <p className="text-xs text-muted-foreground">{driver.email || "No email"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{driver.phoneNumber || "Not provided"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{getDriverRegion(driver)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={kycStatus === "Approved" ? "default" : "secondary"}
                          className={cn(
                            kycStatus === "Approved" ? "bg-green-600 text-white hover:bg-green-600" : "",
                            kycStatus === "Rejected" ? "bg-red-600 text-white hover:bg-red-600" : "",
                          )}
                        >
                          {kycStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{contractLabel}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(driver.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm" className="h-8">
                          <Link href={`/dashboard/admin/drivers/${driver._id.toString()}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
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
            <Link href={buildDriversHref({ page: Math.max(1, currentPage - 1), q, kyc })}>Previous</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(currentPage >= totalPages ? "pointer-events-none opacity-50" : "")}
          >
            <Link href={buildDriversHref({ page: Math.min(totalPages, currentPage + 1), q, kyc })}>Next</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}


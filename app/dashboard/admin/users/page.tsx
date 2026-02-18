import Link from "next/link"
import { Download, Eye, Search } from "lucide-react"

import { CopyButton } from "@/components/dashboard/admin/copy-button"
import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface UsersPageProps {
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

function buildUsersHref({
  page,
  q,
  role,
}: {
  page: number
  q: string
  role: string
}) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (q) params.set("q", q)
  if (role && role !== "all") params.set("role", role)
  const query = params.toString()
  return query ? `/dashboard/admin/users?${query}` : "/dashboard/admin/users"
}

function resolveUserName(user: any) {
  return user.fullName || user.name || user.email || "Unnamed user"
}

function deriveUserStatus(user: any) {
  const normalizedKyc = typeof user.kycStatus === "string" ? user.kycStatus.toLowerCase() : ""
  const isKycApproved =
    user.isKycVerified === true ||
    user.kycVerified === true ||
    ["approved", "approved_stage2", "verified", "completed", "complete"].includes(normalizedKyc)

  if (user.role === "admin") return "Active"
  return isKycApproved ? "Active" : "KYC Pending"
}

function truncate(value: string, max = 24) {
  if (!value) return value
  if (value.length <= max) return value
  return `${value.slice(0, max - 3)}...`
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const resolvedSearchParams = (await searchParams) || {}
  const q = getParam(resolvedSearchParams.q).trim()
  const role = getParam(resolvedSearchParams.role, "all")
  const page = toInt(getParam(resolvedSearchParams.page, "1"), 1)

  const userQuery: Record<string, unknown> = {}

  if (role !== "all" && ["admin", "driver", "investor"].includes(role)) {
    userQuery.role = role
  }

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    userQuery.$or = [{ name: regex }, { fullName: regex }, { email: regex }, { privyUserId: regex }]
  }

  const totalCount = await User.countDocuments(userQuery)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const users = await User.find(userQuery)
    .select("name fullName email privyUserId role kycStatus isKycVerified kycVerified createdAt")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean()

  const from = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, totalCount)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        subtitle="All registered users on the platform."
        actions={
          <>
            <form action="/dashboard/admin/users" className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="relative min-w-[220px] flex-1 sm:w-[280px] sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Search name, email, Privy ID"
                  className="h-9 pl-9"
                />
              </div>
              <select
                name="role"
                defaultValue={role}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="all">All roles</option>
                <option value="investor">Investor</option>
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
              <Button type="submit" variant="outline" className="h-9">
                Apply
              </Button>
            </form>
            <Button asChild variant="outline" className="h-9">
              <Link href="/api/admin/users/export">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Link>
            </Button>
          </>
        }
      />

      <section className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-sm text-muted-foreground">
          <p>
            Showing {from} to {to} of {totalCount} users
          </p>
          <p>Page {currentPage} of {totalPages}</p>
        </div>

        <div className="divide-y divide-border/60 md:hidden">
          {users.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No users found for the selected filters.</div>
          ) : (
            users.map((user: any) => {
              const emailOrPrivy = user.email || user.privyUserId || "N/A"
              const statusLabel = deriveUserStatus(user)

              return (
                <article key={user._id.toString()} className="space-y-3 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{resolveUserName(user)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {user.role || "unknown"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge
                      variant={statusLabel === "Active" ? "default" : "secondary"}
                      className={cn(statusLabel === "Active" ? "bg-green-600 text-white hover:bg-green-600" : "")}
                    >
                      {statusLabel}
                    </Badge>
                    {emailOrPrivy !== "N/A" ? <CopyButton value={emailOrPrivy} /> : null}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{truncate(emailOrPrivy, 42)}</p>
                  {user.privyUserId ? <p className="truncate text-xs text-muted-foreground">{truncate(user.privyUserId, 42)}</p> : null}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/dashboard/admin/users/${user._id.toString()}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View user
                    </Link>
                  </Button>
                </article>
              )
            })
          )}
        </div>

        <div className="hidden max-h-[calc(100vh-280px)] overflow-auto md:block">
          <table className="w-full min-w-[940px] border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Email / Privy ID</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No users found for the selected filters.
                  </td>
                </tr>
              ) : (
                users.map((user: any) => {
                  const emailOrPrivy = user.email || user.privyUserId || "N/A"
                  const statusLabel = deriveUserStatus(user)

                  return (
                    <tr key={user._id.toString()} className="border-b border-border/60">
                      <td className="px-4 py-3 font-medium text-foreground">{resolveUserName(user)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="space-y-0.5">
                            <p className="max-w-[260px] truncate text-foreground">{truncate(emailOrPrivy, 32)}</p>
                            {user.privyUserId ? (
                              <p className="max-w-[260px] truncate text-xs text-muted-foreground">{truncate(user.privyUserId, 32)}</p>
                            ) : null}
                          </div>
                          {emailOrPrivy !== "N/A" ? <CopyButton value={emailOrPrivy} /> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="capitalize">
                          {user.role || "unknown"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={statusLabel === "Active" ? "default" : "secondary"}
                          className={cn(statusLabel === "Active" ? "bg-green-600 text-white hover:bg-green-600" : "")}
                        >
                          {statusLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm" className="h-8">
                          <Link href={`/dashboard/admin/users/${user._id.toString()}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
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
            <Link href={buildUsersHref({ page: Math.max(1, currentPage - 1), q, role })}>Previous</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(currentPage >= totalPages ? "pointer-events-none opacity-50" : "")}
          >
            <Link href={buildUsersHref({ page: Math.min(totalPages, currentPage + 1), q, role })}>Next</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

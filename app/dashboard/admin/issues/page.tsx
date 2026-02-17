import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Eye, Plus, Search } from "lucide-react"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import dbConnect from "@/lib/dbConnect"
import Issue from "@/models/Issue"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface IssuesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback
  return value ?? fallback
}

async function createIssueAction(formData: FormData) {
  "use server"

  const admin = await requireAdminAccess()
  await dbConnect()

  const title = String(formData.get("title") || "").trim()
  const issueType = String(formData.get("issueType") || "").trim()
  const severity = String(formData.get("severity") || "Medium").trim()
  const description = String(formData.get("description") || "").trim()
  const reportedBy = String(formData.get("reportedBy") || "").trim()

  if (!title || !["Payment", "KYC", "Vehicle", "Pool", "Withdrawal"].includes(issueType) || !description) {
    return
  }

  let reportedByUserId: string | undefined
  let reportedByLabel = reportedBy || "System"

  if (reportedBy) {
    const linkedUser = await User.findOne({
      $or: [{ email: reportedBy.toLowerCase() }, { _id: reportedBy }],
    })
      .select("_id name fullName email")
      .lean()
      .catch(() => null)

    if (linkedUser) {
      reportedByUserId = linkedUser._id.toString()
      reportedByLabel = linkedUser.fullName || linkedUser.name || linkedUser.email || reportedByLabel
    }
  }

  await Issue.create({
    title,
    issueType,
    severity,
    status: "Open",
    description,
    reportedByUserId,
    reportedByLabel,
    notes: [
      {
        body: `Issue opened by ${admin.name}.`,
        authorUserId: admin.id,
        createdAt: new Date(),
      },
    ],
  })

  revalidatePath("/dashboard/admin/issues")
}

function badgeClassForSeverity(severity: string) {
  if (severity === "High") return "bg-red-600 text-white hover:bg-red-600"
  if (severity === "Medium") return "bg-amber-600 text-white hover:bg-amber-600"
  return "bg-emerald-600 text-white hover:bg-emerald-600"
}

function badgeClassForStatus(status: string) {
  if (status === "Open") return "bg-red-600 text-white hover:bg-red-600"
  if (status === "In Progress") return "bg-blue-600 text-white hover:bg-blue-600"
  return "bg-emerald-600 text-white hover:bg-emerald-600"
}

export default async function AdminIssuesPage({ searchParams }: IssuesPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const resolvedSearchParams = (await searchParams) || {}
  const q = getParam(resolvedSearchParams.q).trim()
  const status = getParam(resolvedSearchParams.status, "all")
  const issueType = getParam(resolvedSearchParams.type, "all")

  const query: Record<string, unknown> = {}
  if (status !== "all") query.status = status
  if (issueType !== "all") query.issueType = issueType
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    query.$or = [{ title: regex }, { description: regex }, { reportedByLabel: regex }]
  }

  const issues = await Issue.find(query)
    .populate("reportedByUserId", "name fullName email")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Issues"
        subtitle="Operational issues and support flags."
        actions={
          <form action="/dashboard/admin/issues" className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-[220px] flex-1 sm:w-[280px] sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" defaultValue={q} placeholder="Search issues" className="h-9 pl-9" />
            </div>
            <select
              name="type"
              defaultValue={issueType}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All types</option>
              <option value="Payment">Payment</option>
              <option value="KYC">KYC</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Pool">Pool</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
            <select
              name="status"
              defaultValue={status}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <Button type="submit" variant="outline" className="h-9">
              Filter
            </Button>
          </form>
        }
      />

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Create Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createIssueAction} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Issue title" required />
            <select
              name="issueType"
              required
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">Issue type</option>
              <option value="Payment">Payment</option>
              <option value="KYC">KYC</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Pool">Pool</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
            <select
              name="severity"
              defaultValue="Medium"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="Low">Low severity</option>
              <option value="Medium">Medium severity</option>
              <option value="High">High severity</option>
            </select>
            <Input name="reportedBy" placeholder="Reporter email or user id (optional)" />
            <Textarea
              name="description"
              placeholder="Describe the issue for internal tracking"
              required
              className="md:col-span-2"
              rows={3}
            />
            <div className="md:col-span-2">
              <Button type="submit">Create issue</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="max-h-[calc(100vh-430px)] overflow-auto">
          <table className="w-full min-w-[940px] border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Issue Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Severity</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Reported By</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No issues logged yet.
                  </td>
                </tr>
              ) : (
                issues.map((issue: any) => {
                  const reporter = issue.reportedByUserId
                    ? issue.reportedByUserId.fullName || issue.reportedByUserId.name || issue.reportedByUserId.email
                    : issue.reportedByLabel || "Unknown"

                  return (
                    <tr key={issue._id.toString()} className="border-b border-border/60">
                      <td className="px-4 py-3 text-foreground">{issue.issueType}</td>
                      <td className="px-4 py-3">
                        <p className="max-w-[320px] truncate font-medium text-foreground">{issue.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={badgeClassForSeverity(issue.severity)}>{issue.severity}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={badgeClassForStatus(issue.status)}>{issue.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{reporter}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(issue.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm" className="h-8">
                          <Link href={`/dashboard/admin/issues/${issue._id.toString()}`}>
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
      </section>
    </div>
  )
}


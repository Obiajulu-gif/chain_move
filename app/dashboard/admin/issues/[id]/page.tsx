import Link from "next/link"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import dbConnect from "@/lib/dbConnect"
import Issue from "@/models/Issue"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface IssueDetailsPageProps {
  params: Promise<{ id: string }>
}

function severityClass(severity: string) {
  if (severity === "High") return "bg-red-600 text-white hover:bg-red-600"
  if (severity === "Medium") return "bg-amber-600 text-white hover:bg-amber-600"
  return "bg-emerald-600 text-white hover:bg-emerald-600"
}

function statusClass(status: string) {
  if (status === "Open") return "bg-red-600 text-white hover:bg-red-600"
  if (status === "In Progress") return "bg-blue-600 text-white hover:bg-blue-600"
  return "bg-emerald-600 text-white hover:bg-emerald-600"
}

async function updateIssueAction(issueId: string, formData: FormData) {
  "use server"

  const admin = await requireAdminAccess()
  await dbConnect()

  const nextStatus = String(formData.get("status") || "").trim()
  const note = String(formData.get("note") || "").trim()

  if (!["Open", "In Progress", "Resolved"].includes(nextStatus)) {
    return
  }

  const issue = await Issue.findById(issueId)
  if (!issue) {
    return
  }

  issue.status = nextStatus as any
  if (note) {
    issue.notes.push({
      body: note,
      authorUserId: admin.id as any,
      createdAt: new Date(),
    })
  }
  await issue.save()

  revalidatePath("/dashboard/admin/issues")
  revalidatePath(`/dashboard/admin/issues/${issueId}`)
}

export default async function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  const admin = await requireAdminAccess()
  await dbConnect()

  const { id } = await params
  const issue = await Issue.findById(id)
    .populate("reportedByUserId", "name fullName email")
    .lean()

  if (!issue) {
    notFound()
  }

  const noteAuthorIds = Array.from(
    new Set(
      (issue.notes || [])
        .map((note: any) => note.authorUserId?.toString?.())
        .filter(Boolean),
    ),
  )
  const noteAuthors = noteAuthorIds.length
    ? await User.find({ _id: { $in: noteAuthorIds } }).select("name fullName email").lean()
    : []
  const noteAuthorById = new Map(noteAuthors.map((entry: any) => [entry._id.toString(), entry]))

  const reporter = issue.reportedByUserId
    ? issue.reportedByUserId.fullName || issue.reportedByUserId.name || issue.reportedByUserId.email
    : issue.reportedByLabel || "Unknown"

  const boundUpdate = updateIssueAction.bind(null, id)

  return (
    <div className="space-y-5">
      <PageHeader
        title={issue.title}
        subtitle="Issue details, status updates, and internal notes."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/issues">Back to Issues</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="border-border/70 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Issue Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{issue.issueType}</Badge>
              <Badge className={severityClass(issue.severity)}>{issue.severity}</Badge>
              <Badge className={statusClass(issue.status)}>{issue.status}</Badge>
            </div>
            <p className="text-muted-foreground">Reported by: {reporter}</p>
            <p className="text-muted-foreground">Created: {new Date(issue.createdAt).toLocaleString()}</p>
            <p className="rounded-lg border border-border/70 bg-muted/40 p-3 text-foreground">{issue.description || "No description provided."}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Update Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={boundUpdate} className="space-y-3">
              <select
                name="status"
                defaultValue={issue.status}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <Textarea name="note" placeholder={`Add internal note as ${admin.name}`} rows={4} />
              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Internal Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {issue.notes?.length ? (
            issue.notes
              .slice()
              .reverse()
              .map((note: any, index: number) => {
                const author = note.authorUserId ? noteAuthorById.get(note.authorUserId.toString()) : null
                const authorLabel = author ? author.fullName || author.name || author.email : "System"

                return (
                  <div key={`${note.createdAt}-${index}`} className="rounded-lg border border-border/70 p-3 text-sm">
                    <p className="text-foreground">{note.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {authorLabel} • {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                )
              })
          ) : (
            <p className="text-sm text-muted-foreground">No internal notes added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


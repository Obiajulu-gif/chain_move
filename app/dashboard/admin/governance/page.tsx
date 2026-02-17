import { revalidatePath } from "next/cache"
import { CalendarClock, Save } from "lucide-react"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dbConnect from "@/lib/dbConnect"
import PlatformSetting from "@/models/PlatformSetting"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

async function saveSettingsAction(formData: FormData) {
  "use server"

  const admin = await requireAdminAccess()
  await dbConnect()

  const minimumContributionNgn = Number.parseFloat(String(formData.get("minimumContributionNgn") || "0"))
  const platformFeeRateBps = Number.parseFloat(String(formData.get("platformFeeRateBps") || "0"))
  const defaultRepaymentDurationWeeks = Number.parseInt(String(formData.get("defaultRepaymentDurationWeeks") || "0"), 10)
  const defaultRoiPercent = Number.parseFloat(String(formData.get("defaultRoiPercent") || "0"))

  if (
    !Number.isFinite(minimumContributionNgn) ||
    minimumContributionNgn < 0 ||
    !Number.isFinite(platformFeeRateBps) ||
    platformFeeRateBps < 0 ||
    platformFeeRateBps > 10000 ||
    !Number.isFinite(defaultRepaymentDurationWeeks) ||
    defaultRepaymentDurationWeeks < 1 ||
    !Number.isFinite(defaultRoiPercent) ||
    defaultRoiPercent < 0 ||
    defaultRoiPercent > 100
  ) {
    return
  }

  await PlatformSetting.findOneAndUpdate(
    { singletonKey: "default" },
    {
      minimumContributionNgn,
      platformFeeRateBps,
      defaultRepaymentDurationWeeks,
      defaultRoiPercent,
      updatedByUserId: admin.id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  revalidatePath("/dashboard/admin/governance")
}

export default async function AdminGovernancePage() {
  await requireAdminAccess()
  await dbConnect()

  const settings = await PlatformSetting.findOne({ singletonKey: "default" }).lean()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Governance"
        subtitle="Platform-level configuration and governance controls."
      />

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Platform Settings</CardTitle>
          <CardDescription>
            Configure minimum contribution, fee rate, repayment defaults, and baseline ROI assumptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSettingsAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Minimum contribution per pool (NGN)</span>
              <input
                name="minimumContributionNgn"
                defaultValue={settings?.minimumContributionNgn ?? 5000}
                required
                inputMode="decimal"
                className="h-10 w-full rounded-md border border-input bg-background px-3"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Platform fee rate (basis points)</span>
              <input
                name="platformFeeRateBps"
                defaultValue={settings?.platformFeeRateBps ?? 250}
                required
                inputMode="decimal"
                className="h-10 w-full rounded-md border border-input bg-background px-3"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Default repayment duration (weeks)</span>
              <input
                name="defaultRepaymentDurationWeeks"
                defaultValue={settings?.defaultRepaymentDurationWeeks ?? 52}
                required
                inputMode="numeric"
                className="h-10 w-full rounded-md border border-input bg-background px-3"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Default ROI assumption (%)</span>
              <input
                name="defaultRoiPercent"
                defaultValue={settings?.defaultRoiPercent ?? 24}
                required
                inputMode="decimal"
                className="h-10 w-full rounded-md border border-input bg-background px-3"
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                Last updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : "Not updated yet"}
              </p>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Governance Proposals</CardTitle>
          <CardDescription>
            Proposal tooling is currently in baseline mode. Create workflow hooks here when proposal voting is enabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No active proposals yet. This section is reserved for governance proposal creation and voting summaries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


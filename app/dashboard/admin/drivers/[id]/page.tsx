import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import dbConnect from "@/lib/dbConnect"
import DriverPayment from "@/models/DriverPayment"
import HirePurchaseContract from "@/models/HirePurchaseContract"
import User from "@/models/User"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface DriverDetailsPageProps {
  params: Promise<{ id: string }>
}

function displayName(user: any) {
  return user.fullName || user.name || user.email || "Unnamed driver"
}

function getKycStatus(user: any) {
  if (user.isKycVerified === true || user.kycVerified === true) return "Approved"
  const raw = typeof user.kycStatus === "string" ? user.kycStatus.toLowerCase() : ""
  if (["approved", "approved_stage2", "verified", "complete", "completed"].includes(raw)) return "Approved"
  if (["rejected", "rejected_stage2"].includes(raw)) return "Rejected"
  return "Pending"
}

export default async function DriverDetailsPage({ params }: DriverDetailsPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const { id } = await params
  const driver = await User.findOne({ _id: id, role: "driver" })
    .select("name fullName email phoneNumber kycStatus kycDocuments isKycVerified kycVerified createdAt")
    .lean()

  if (!driver) {
    notFound()
  }

  const [contracts, payments] = await Promise.all([
    HirePurchaseContract.find({ driverUserId: driver._id })
      .select("vehicleDisplayName assetType status totalPayableNgn totalPaidNgn weeklyPaymentNgn nextDueDate createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    DriverPayment.find({ driverUserId: driver._id })
      .select("amountNgn appliedAmountNgn status method paystackRef createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ])

  return (
    <div className="space-y-5">
      <PageHeader
        title={displayName(driver)}
        subtitle="Driver profile, KYC state, contracts, and payment history."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/drivers">Back to Drivers</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Basic Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {driver.email || "N/A"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {driver.phoneNumber || "N/A"}</p>
            <p><span className="text-muted-foreground">Joined:</span> {new Date(driver.createdAt).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">KYC Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant={getKycStatus(driver) === "Approved" ? "default" : "secondary"}>{getKycStatus(driver)}</Badge>
            </p>
            <p>
              <span className="text-muted-foreground">Documents:</span>{" "}
              {Array.isArray((driver as any).kycDocuments) ? (driver as any).kycDocuments.length : 0}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Contracts Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Total Contracts:</span> {contracts.length}</p>
            <p>
              <span className="text-muted-foreground">Active Contracts:</span>{" "}
              {contracts.filter((contract: any) => contract.status === "ACTIVE").length}
            </p>
            <p>
              <span className="text-muted-foreground">Completed:</span>{" "}
              {contracts.filter((contract: any) => contract.status === "COMPLETED").length}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contracts assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {contracts.map((contract: any) => (
                  <div key={contract._id.toString()} className="rounded-lg border border-border/70 p-3 text-sm">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="font-medium">{contract.vehicleDisplayName}</p>
                      <Badge variant="secondary">{contract.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">Asset: {contract.assetType}</p>
                    <p className="text-muted-foreground">Total payable: {formatNaira(contract.totalPayableNgn)}</p>
                    <p className="text-muted-foreground">Total paid: {formatNaira(contract.totalPaidNgn)}</p>
                    <p className="text-muted-foreground">Weekly payment: {formatNaira(contract.weeklyPaymentNgn)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment: any) => (
                  <div key={payment._id.toString()} className="rounded-lg border border-border/70 p-3 text-sm">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="font-medium">{formatNaira(payment.amountNgn)}</p>
                      <Badge variant={payment.status === "CONFIRMED" ? "default" : "secondary"}>{payment.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">Applied: {formatNaira(payment.appliedAmountNgn || 0)}</p>
                    <p className="text-muted-foreground">Method: {payment.method}</p>
                    <p className="text-muted-foreground">Reference: {payment.paystackRef}</p>
                    <p className="text-muted-foreground">{new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


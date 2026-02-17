import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import dbConnect from "@/lib/dbConnect"
import HirePurchaseContract from "@/models/HirePurchaseContract"
import User from "@/models/User"
import Vehicle from "@/models/Vehicle"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface VehicleDetailsPageProps {
  params: Promise<{ id: string }>
}

function normalizeStatus(status: string) {
  const normalized = (status || "").toLowerCase()
  if (normalized === "maintenance") return "Under Maintenance"
  if (normalized === "retired") return "Retired"
  if (normalized === "financed" || normalized === "reserved") return "Assigned"
  return "Available"
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const { id } = await params
  const vehicle = await Vehicle.findById(id).populate("driverId", "name fullName email").lean()

  if (!vehicle) {
    notFound()
  }

  const contract = await HirePurchaseContract.findOne({ vehicleDisplayName: vehicle.name })
    .select("status totalPayableNgn totalPaidNgn nextDueDate")
    .sort({ createdAt: -1 })
    .lean()

  const driver = vehicle.driverId
    ? await User.findById((vehicle.driverId as any)._id).select("name fullName email phoneNumber").lean()
    : null

  return (
    <div className="space-y-5">
      <PageHeader
        title={vehicle.name}
        subtitle="Vehicle profile and assignment details."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/vehicles">Back to Vehicles</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Vehicle Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Type:</span> {vehicle.type}</p>
            <p><span className="text-muted-foreground">Identifier:</span> {vehicle.identifier || vehicle.specifications?.vin || "N/A"}</p>
            <p><span className="text-muted-foreground">Year:</span> {vehicle.year}</p>
            <p><span className="text-muted-foreground">Price:</span> {formatNaira(vehicle.price)}</p>
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant="secondary">{normalizeStatus(vehicle.status)}</Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Assigned Driver</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {driver ? (
              <>
                <p><span className="text-muted-foreground">Name:</span> {driver.fullName || driver.name || "N/A"}</p>
                <p><span className="text-muted-foreground">Email:</span> {driver.email || "N/A"}</p>
                <p><span className="text-muted-foreground">Phone:</span> {driver.phoneNumber || "N/A"}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No driver assigned.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Contract Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {contract ? (
              <>
                <p><span className="text-muted-foreground">Status:</span> <Badge variant="secondary">{contract.status}</Badge></p>
                <p><span className="text-muted-foreground">Total payable:</span> {formatNaira(contract.totalPayableNgn)}</p>
                <p><span className="text-muted-foreground">Total paid:</span> {formatNaira(contract.totalPaidNgn)}</p>
                <p>
                  <span className="text-muted-foreground">Next due date:</span>{" "}
                  {contract.nextDueDate ? new Date(contract.nextDueDate).toLocaleDateString() : "N/A"}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No linked hire purchase contract found.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


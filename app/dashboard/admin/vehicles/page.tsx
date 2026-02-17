import Link from "next/link"
import mongoose from "mongoose"
import { revalidatePath } from "next/cache"
import { Eye, Plus, Search, Wrench } from "lucide-react"

import { PageHeader } from "@/components/dashboard/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dbConnect from "@/lib/dbConnect"
import HirePurchaseContract from "@/models/HirePurchaseContract"
import InvestmentPool from "@/models/InvestmentPool"
import User from "@/models/User"
import Vehicle from "@/models/Vehicle"
import { requireAdminAccess } from "@/src/server/admin/require-admin"

export const dynamic = "force-dynamic"

interface VehiclesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback
  return value ?? fallback
}

function normalizeStatus(status: string) {
  const normalized = (status || "").toLowerCase()
  if (normalized === "maintenance") return "Under Maintenance"
  if (normalized === "retired") return "Retired"
  if (normalized === "financed" || normalized === "reserved") return "Assigned"
  return "Available"
}

function statusBadgeVariant(label: string) {
  if (label === "Assigned") return "bg-blue-600 text-white hover:bg-blue-600"
  if (label === "Under Maintenance") return "bg-amber-600 text-white hover:bg-amber-600"
  if (label === "Retired") return "bg-zinc-600 text-white hover:bg-zinc-600"
  return "bg-green-600 text-white hover:bg-green-600"
}

async function createVehicleAction(formData: FormData) {
  "use server"

  await requireAdminAccess()
  await dbConnect()

  const name = String(formData.get("name") || "").trim()
  const type = String(formData.get("type") || "").trim()
  const identifier = String(formData.get("identifier") || "").trim()
  const year = Number.parseInt(String(formData.get("year") || "0"), 10)
  const price = Number.parseFloat(String(formData.get("price") || "0"))

  if (!name || !type || !identifier || !Number.isFinite(year) || year < 1990 || !Number.isFinite(price) || price <= 0) {
    return
  }

  await Vehicle.create({
    name,
    identifier,
    type,
    year,
    price,
    roi: 0,
    features: [],
    status: "Available",
    addedDate: new Date(),
    specifications: {
      vin: identifier,
    },
  })

  revalidatePath("/dashboard/admin/vehicles")
}

async function updateVehicleAction(formData: FormData) {
  "use server"

  await requireAdminAccess()
  await dbConnect()

  const vehicleId = String(formData.get("vehicleId") || "").trim()
  const action = String(formData.get("action") || "assign")
  const driverId = String(formData.get("driverId") || "").trim()

  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return
  }

  if (action === "assign") {
    if (!mongoose.Types.ObjectId.isValid(driverId)) return

    const driver = await User.findOne({ _id: driverId, role: "driver" }).select("_id")
    if (!driver) return

    await Vehicle.findByIdAndUpdate(vehicleId, {
      driverId: driver._id,
      status: "Financed",
    })
  } else if (action === "maintenance") {
    await Vehicle.findByIdAndUpdate(vehicleId, { status: "Maintenance" })
  } else if (action === "retire") {
    await Vehicle.findByIdAndUpdate(vehicleId, { status: "Retired", $unset: { driverId: 1 } })
  } else if (action === "available") {
    await Vehicle.findByIdAndUpdate(vehicleId, { status: "Available", $unset: { driverId: 1 } })
  }

  revalidatePath("/dashboard/admin/vehicles")
}

export default async function AdminVehiclesPage({ searchParams }: VehiclesPageProps) {
  await requireAdminAccess()
  await dbConnect()

  const resolvedSearchParams = (await searchParams) || {}
  const q = getParam(resolvedSearchParams.q).trim()
  const type = getParam(resolvedSearchParams.type, "all")
  const status = getParam(resolvedSearchParams.status, "all")

  const query: Record<string, unknown> = {}

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    query.$or = [{ name: regex }, { type: regex }, { identifier: regex }, { "specifications.vin": regex }]
  }

  if (type !== "all") {
    query.type = type
  }

  if (status === "available") query.status = "Available"
  if (status === "assigned") query.status = { $in: ["Financed", "Reserved"] }
  if (status === "maintenance") query.status = "Maintenance"
  if (status === "retired") query.status = "Retired"

  const [vehicles, drivers] = await Promise.all([
    Vehicle.find(query)
      .populate("driverId", "name fullName email")
      .sort({ addedDate: -1 })
      .lean(),
    User.find({ role: "driver" })
      .select("name fullName email")
      .sort({ createdAt: -1 })
      .lean(),
  ])

  const vehicleNames = vehicles.map((vehicle: any) => vehicle.name).filter(Boolean)
  const contracts = vehicleNames.length
    ? await HirePurchaseContract.find({ vehicleDisplayName: { $in: vehicleNames } })
      .select("vehicleDisplayName poolId")
      .lean()
    : []

  const poolIds = Array.from(new Set(contracts.map((contract: any) => contract.poolId?.toString()).filter(Boolean)))
  const pools = poolIds.length ? await InvestmentPool.find({ _id: { $in: poolIds } }).select("assetType status").lean() : []
  const poolById = new Map(pools.map((pool: any) => [pool._id.toString(), pool]))

  const poolByVehicleName = new Map<string, string>()
  for (const contract of contracts) {
    const pool = poolById.get(contract.poolId?.toString())
    if (!pool) continue
    if (!poolByVehicleName.has(contract.vehicleDisplayName)) {
      poolByVehicleName.set(contract.vehicleDisplayName, `${pool.assetType} (${pool.status})`)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicles"
        subtitle="Manage platform vehicle inventory and assignments."
        actions={
          <form action="/dashboard/admin/vehicles" className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-[220px] flex-1 sm:w-[260px] sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" defaultValue={q} placeholder="Search by name or identifier" className="h-9 pl-9" />
            </div>
            <select
              name="type"
              defaultValue={type}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All types</option>
              <option value="KEKE">KEKE</option>
              <option value="SHUTTLE">SHUTTLE</option>
            </select>
            <select
              name="status"
              defaultValue={status}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="retired">Retired</option>
            </select>
            <Button type="submit" variant="outline" className="h-9">
              Filter
            </Button>
          </form>
        }
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createVehicleAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input name="name" placeholder="Vehicle display name" required />
              <select
                name="type"
                required
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">Select type</option>
                <option value="KEKE">KEKE</option>
                <option value="SHUTTLE">SHUTTLE</option>
              </select>
              <Input name="identifier" placeholder="Plate number / identifier" required />
              <Input name="year" placeholder="Year" inputMode="numeric" required />
              <Input name="price" placeholder="Price (NGN)" inputMode="decimal" required />
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Add Vehicle
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4" />
              Update Vehicle Assignment / Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateVehicleAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                name="vehicleId"
                required
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground sm:col-span-2"
              >
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle: any) => (
                  <option key={vehicle._id.toString()} value={vehicle._id.toString()}>
                    {vehicle.name} ({vehicle.identifier || vehicle.specifications?.vin || "no id"})
                  </option>
                ))}
              </select>
              <select
                name="action"
                required
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="assign">Assign to driver</option>
                <option value="maintenance">Mark maintenance</option>
                <option value="available">Mark available</option>
                <option value="retire">Mark retired</option>
              </select>
              <select
                name="driverId"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">Select driver (for assignment)</option>
                {drivers.map((driver: any) => (
                  <option key={driver._id.toString()} value={driver._id.toString()}>
                    {driver.fullName || driver.name || driver.email}
                  </option>
                ))}
              </select>
              <div className="sm:col-span-2">
                <Button type="submit" variant="outline" className="w-full sm:w-auto">
                  Save Update
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="max-h-[calc(100vh-360px)] overflow-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Vehicle Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Identifier</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Linked Pool</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Linked Driver</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle: any) => {
                  const statusLabel = normalizeStatus(vehicle.status)
                  const driverLabel = vehicle.driverId
                    ? vehicle.driverId.fullName || vehicle.driverId.name || vehicle.driverId.email
                    : "Not assigned"
                  const linkedPool = poolByVehicleName.get(vehicle.name) || "Not linked"

                  return (
                    <tr key={vehicle._id.toString()} className="border-b border-border/60">
                      <td className="px-4 py-3 font-medium text-foreground">{vehicle.type || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {vehicle.identifier || vehicle.specifications?.vin || "Not provided"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default" className={cn(statusBadgeVariant(statusLabel))}>
                          {statusLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{linkedPool}</td>
                      <td className="px-4 py-3 text-muted-foreground">{driverLabel}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(vehicle.addedDate || vehicle.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm" className="h-8">
                          <Link href={`/dashboard/admin/vehicles/${vehicle._id.toString()}`}>
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


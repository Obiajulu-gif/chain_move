import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"

export default function Loading() {
  return (
    <DashboardRouteLoading
      title="Loading DAO governance"
      description="Preparing proposals, treasury metrics, and wallet voting state."
    />
  )
}

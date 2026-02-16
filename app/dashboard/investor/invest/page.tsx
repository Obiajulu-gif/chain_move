import { redirect } from "next/navigation"

export default function LegacyInvestPage() {
  redirect("/dashboard/investor/opportunities")
}

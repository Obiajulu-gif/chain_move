import { redirect } from "next/navigation"

interface AdminSlugRedirectPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function AdminSlugRedirectPage({ params }: AdminSlugRedirectPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || []
  redirect(`/dashboard/admin/${slug.join("/")}`)
}


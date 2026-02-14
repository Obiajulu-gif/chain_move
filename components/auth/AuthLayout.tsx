import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  sideTitle?: string
  sideDescription?: string
  sidePoints?: string[]
  badge?: string
}

const defaultSidePoints = [
  "Transparent mobility ownership records",
  "Structured pay-to-own driver journeys",
  "Investor and operator visibility from one dashboard",
]

export function AuthLayout({
  title,
  description,
  children,
  footer,
  sideTitle = "Mobility financing, built for trust",
  sideDescription =
    "ChainMove helps drivers and investors coordinate asset-backed mobility with clear records, transparent payouts, and dependable operations.",
  sidePoints = defaultSidePoints,
  badge,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-stretch">
        <section className="rounded-2xl border border-[#ECECEC] bg-white p-6 shadow-[0_10px_40px_rgba(31,31,31,0.08)] sm:p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E]"
          >
            <Image src="/images/chainmovelogo.png" alt="ChainMove logo" width={36} height={36} priority />
            <span className="text-lg font-semibold text-[#1F1F1F]">ChainMove</span>
          </Link>

          {badge ? (
            <p className="mt-5 inline-flex rounded-full bg-[#F2780E]/10 px-3 py-1 text-xs font-medium text-[#B85700]">
              {badge}
            </p>
          ) : null}

          <h1 className="mt-4 text-2xl font-semibold leading-tight text-[#1F1F1F]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#666666]">{description}</p>

          <div className="mt-6">{children}</div>

          {footer ? <div className="mt-6 border-t border-[#F0F0F0] pt-5">{footer}</div> : null}
        </section>

        <aside className="relative hidden overflow-hidden rounded-2xl bg-[#1F1F1F] p-10 text-white shadow-[0_10px_40px_rgba(31,31,31,0.12)] lg:flex">
          <Image
            src="/images/outside.jpg"
            alt="ChainMove mobility operations"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 0vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/65 to-black/80" aria-hidden="true" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-medium tracking-wide text-white/90">
                ChainMove Platform
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight">{sideTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/80">{sideDescription}</p>
            </div>

            <ul className="mt-8 space-y-4">
              {sidePoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-white/90">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#F2780E]" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

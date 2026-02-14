import { Container } from "@/components/landing/Container"
import { BadgeCheck, BriefcaseBusiness, ChevronRight, Eye, Wallet } from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    title: "Fractional Ownership of Real Assets",
    body: "Own a share in insured transport vehicles operating daily.",
    icon: Wallet,
  },
  {
    title: "Blockchain-Secured Transparency",
    body: "All ownership records and earnings distributions are secured and verifiable.",
    icon: BadgeCheck,
  },
  {
    title: "Structured Pay-To-Own Model",
    body: "Drivers build ownership gradually while investors earn from structured repayments.",
    icon: BriefcaseBusiness,
  },
  {
    title: "You Don't Manage Vehicles",
    body: "We handle driver onboarding, documentation, monitoring, and reporting.",
    icon: Eye,
  },
]

export function WhyInvestSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="rounded-3xl bg-cm-dark px-6 py-10 text-cm-text md:px-10 md:py-12 lg:px-14 lg:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-[16px] text-cm-muted">
                Benefits
              </p>
              <h2 className="mt-5 text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-cm-text md:text-[42px]">
                Why Invest with <span className="text-cm-orange">Chainmove?</span>
              </h2>
              <p className="mt-4 text-[16px] sm:text-[19px] leading-[1.2] text-cm-muted">
                Built for disciplined capital. Designed for long-term returns.
              </p>
            </div>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-7 py-3.5 text-[16px] sm:text-[18px] font-medium text-cm-text transition-colors hover:bg-white/10"
            >
              Explore Ownership Benefits
              <ChevronRight className="ml-2.5 h-5 w-5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-3xl border border-cm-border-dark bg-cm-dark-2 p-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/6">
                  <benefit.icon className="h-8 w-8 text-cm-text" />
                </div>
                <h3 className="mt-6 text-[20px] sm:text-[22px] font-semibold leading-[1.08] text-cm-text">{benefit.title}</h3>
                <p className="mt-4 text-[16px] sm:text-[19px] leading-[1.2] text-cm-muted">{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

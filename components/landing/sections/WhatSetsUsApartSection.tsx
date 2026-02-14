import { Container } from "@/components/landing/Container"
import { Coins, CreditCard, ShieldCheck } from "lucide-react"

const differentiators = [
  {
    title: "Fractional Ownership",
    body: "Access vehicle-backed opportunities without needing to fund an entire fleet alone.",
    icon: Coins,
  },
  {
    title: "Flexible Payment",
    body: "Structured plans support predictable cash flow for drivers and transparent reporting for investors.",
    icon: CreditCard,
  },
  {
    title: "Blockchain Solution",
    body: "Ownership records and operational events are secured through verifiable blockchain-backed workflows.",
    icon: ShieldCheck,
  },
]

export function WhatSetsUsApartSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="max-w-[760px]">
          <p className="text-[15px] font-medium uppercase tracking-wide text-[#7a7a7a]">Why ChainMove</p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] sm:text-[36px] md:text-[42px]">
            What Sets Us Apart
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {differentiators.map((item) => (
            <article key={item.title} className="rounded-3xl border border-cm-border-light bg-[#fcf8f6] p-6 md:p-7">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cm-dark text-white">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-[21px] font-semibold leading-[1.1] text-[#2a2a2a]">{item.title}</h3>
              <p className="mt-4 text-[16px] leading-[1.3] text-[#6f6f6f] sm:text-[18px]">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

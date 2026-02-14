import { Container } from "@/components/landing/Container"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: "01",
    title: "Co-Invest in Transport Assets",
    body: "Pool funds with other investors to acquire shuttles, tricycles, and mobility vehicles placed on structured pay-to-own plans. You are co-owning income-generating assets operating daily in real markets.",
  },
  {
    number: "02",
    title: "Vetted Driver Placement",
    body: "Every driver goes through identity checks, background screening, and onboarding before receiving a vehicle. We place disciplined operators on structured agreements designed to protect both investors and drivers.",
  },
  {
    number: "03",
    title: "Payments & Smart Distribution",
    body: "Drivers make payments through traditional bank channels. Smart contracts handle automated payout distribution. No manual accounting. Earnings are distributed transparently based on your ownership share.",
  },
  {
    number: "04",
    title: "Real-Time Tracking",
    body: "Monitor asset performance, payment history, and earnings from anywhere in the world. Whether you are in Enugu, Lagos, London, or Houston, your dashboard gives you full visibility.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[820px]">
            <p className="text-[15px] font-medium text-[#666]">How it Works</p>
            <h2 className="mt-2 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              How Chainmove Works?
            </h2>
            <p className="mt-5 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              A simple, structured way to invest in mobility without managing vehicles yourself.
            </p>
          </div>

          <Link
            href="#"
            className="inline-flex h-14 items-center justify-center rounded-full bg-cm-orange px-7 text-[16px] sm:text-[18px] font-semibold text-white transition-colors hover:bg-[#de6805]"
          >
            See How Capital Flows
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="mt-11 grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-3xl border border-cm-border-light bg-[#F6F0EC] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:p-8"
            >
              <p className="text-[20px] sm:text-[22px] font-medium leading-none text-cm-orange">{step.number}</p>
              <h3 className="mt-7 text-[20px] sm:text-[20px] font-semibold leading-[1.08] text-[#2f2f2f]">{step.title}</h3>
              <p className="mt-5 text-[16px] sm:text-[19px] leading-[1.2] text-[#767676]">{step.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

import { Container } from "@/components/landing/Container"
import { ClipboardCheck, Eye, LockKeyhole, TrendingUp, Users, WalletCards } from "lucide-react"

const values = [
  {
    title: "Transparency",
    body: "Clear records, clear terms, and clear reporting for every stakeholder.",
    icon: Eye,
  },
  {
    title: "Discipline",
    body: "Operational structure and repayment consistency guide how we scale.",
    icon: ClipboardCheck,
  },
  {
    title: "Security",
    body: "Legal safeguards and blockchain-backed workflows protect participants.",
    icon: LockKeyhole,
  },
  {
    title: "Driver Empowerment",
    body: "We build pathways that move drivers from operators to owners.",
    icon: Users,
  },
  {
    title: "Long-term Value",
    body: "We optimize for sustainable mobility outcomes, not short-term hype.",
    icon: TrendingUp,
  },
  {
    title: "Accountability",
    body: "Every capital flow and operational milestone must be measurable.",
    icon: WalletCards,
  },
]

export function CoreValuesSection() {
  return (
    <section className="bg-[#f7f7f7] py-20 md:py-24">
      <Container>
        <div className="max-w-[760px]">
          <p className="text-[15px] font-medium uppercase tracking-wide text-[#7a7a7a]">Foundation</p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] sm:text-[36px] md:text-[42px]">
            Our Core Values
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-3xl border border-cm-border-light bg-white p-6 md:p-7">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cm-orange/15 text-cm-orange">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-[20px] font-semibold leading-[1.1] text-[#2a2a2a]">{value.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.3] text-[#6f6f6f] sm:text-[18px]">{value.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

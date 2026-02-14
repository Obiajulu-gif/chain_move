import { Container } from "@/components/landing/Container"

const milestones = [
  {
    title: "2024 — Company Founded",
    body: "ChainMove was established with a vision to democratize vehicle financing.",
  },
  {
    title: "2024 — MVP Launch",
    body: "Launched our minimum viable product on Lisk testnet.",
  },
  {
    title: "2025 — Seed Funding",
    body: "Raised $20,000 in seed funding from AyaHq X LiskHQ Incubation Program.",
  },
  {
    title: "2025 — Mainnet Launch",
    body: "Successfully deployed on Lisk mainnet with first vehicle fundings.",
  },
  {
    title: "2025 — Global Expansion",
    body: "Expanding operations to 5 new countries across Africa.",
  },
]

export function JourneyMilestonesSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="max-w-[760px]">
          <p className="text-[15px] font-medium uppercase tracking-wide text-[#7a7a7a]">Progress</p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] sm:text-[36px] md:text-[42px]">
            Journey & Milestones
          </h2>
        </div>

        <div className="relative mt-10 space-y-4 md:space-y-7 md:pl-12">
          <div className="pointer-events-none absolute bottom-0 left-3 top-0 hidden w-px bg-cm-border-light md:block" />
          {milestones.map((item) => (
            <article
              key={item.title}
              className="relative rounded-3xl border border-cm-border-light bg-[#fcf8f6] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.04)] md:p-7"
            >
              <span
                className="pointer-events-none absolute left-[-41px] top-8 hidden h-3 w-3 rounded-full bg-cm-orange ring-4 ring-white md:block"
                aria-hidden="true"
              />
              <h3 className="text-[22px] font-semibold leading-[1.08] text-[#2a2a2a]">{item.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.3] text-[#6f6f6f] sm:text-[18px]">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

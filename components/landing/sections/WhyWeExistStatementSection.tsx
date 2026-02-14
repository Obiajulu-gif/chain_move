import { Container } from "@/components/landing/Container"

export function WhyWeExistStatementSection() {
  return (
    <section className="bg-[#f2f2f2] py-24 md:py-28">
      <Container>
        <h2 className="mx-auto max-w-[980px] text-center text-[30px] sm:text-[36px] font-bold leading-[1.08] tracking-[-0.03em] text-cm-heading md:text-[56px]">
          We build systems where drivers grow into owners and investors
          <span className="text-cm-orange"> participate in real, asset-backed mobility.</span>
        </h2>
      </Container>
    </section>
  )
}

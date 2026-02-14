import { Container } from "@/components/landing/Container"

const steps = [
  {
    number: "01",
    title: "Apply and Get Verified",
    body: "Submit your details, valid documents and pay 20% upfront fee. We run background checks to ensure safety and trust for everyone on the platform.",
  },
  {
    number: "02",
    title: "Get an Insured Vehicle",
    body: "The vehicle comes with proper documentation and insurance so you can operate without unnecessary fear or confusion.",
  },
  {
    number: "03",
    title: "Drive & Pay Small-Small Daily",
    body: "You drive normally and make your income. A fixed daily amount is paid toward ownership. Payments are made easily through normal bank transfer or POS.",
  },
  {
    number: "04",
    title: "Become the Full Owner",
    body: "After completing your payment plan, the vehicle becomes fully yours. No more daily remittance, you now own your asset completely.",
  },
]

export function ClearPathToOwnershipSection() {
  return (
    <section className="bg-black py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="max-w-[780px] text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[42px]">
            A Clear Path to <span className="text-cm-orange">Ownership</span>
          </h2>
          <p className="max-w-[720px] text-[16px] sm:text-[19px] leading-[1.2] text-[#d2d2d2]">
            From application to ownership, everything is clear, structured, and built to help you succeed on the road.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="rounded-3xl bg-[#f4f2f1] p-6">
              <p className="text-[20px] sm:text-[22px] font-medium leading-none text-cm-orange">{step.number}</p>
              <h3 className="mt-6 text-[20px] sm:text-[20px] font-semibold leading-[1.08] text-[#242424]">{step.title}</h3>
              <p className="mt-4 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">{step.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

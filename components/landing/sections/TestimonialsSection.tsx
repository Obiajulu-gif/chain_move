import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import Image from "next/image"

const testimonials = [
  {
    name: "Olisa Egbebu",
    role: "ChainMove Driver",
    quote:
      "ChainMove gave me a clear structure. I now drive with confidence, track my payments, and I can finally see my ownership growing.",
    image: landingAssets.testimonials[0],
  },
  {
    name: "Augustine Dike",
    role: "ChainMove Investor",
    quote:
      "I like that this is tied to real assets. The dashboard gives me visibility, and the repayment model is transparent and disciplined.",
    image: landingAssets.testimonials[1],
  },
  {
    name: "Aguata Mass Transit",
    role: "Mobility Entrepreneur",
    quote:
      "This model bridges driver growth and investor confidence. It is practical, local, and designed for long-term mobility outcomes.",
    image: landingAssets.testimonials[2],
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[42px]">
            Words on the Street
          </h2>
          <p className="max-w-[680px] text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
            Real stories from drivers, investors, and mobility operators using ChainMove.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name + testimonial.role}
              className="rounded-3xl border border-cm-border-light bg-[#fcf8f6] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#d8d8d8]">
                  <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[16px] sm:text-[19px] font-semibold leading-none text-[#2a2a2a]">{testimonial.name}</p>
                  <p className="mt-1 text-[16px] sm:text-[18px] text-[#777]">{testimonial.role}</p>
                </div>
              </div>

              <p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#5f5f5f]">\"{testimonial.quote}\"</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

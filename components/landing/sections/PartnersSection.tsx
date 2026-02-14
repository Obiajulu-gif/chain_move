import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import Image from "next/image"

export function PartnersSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="flex items-center gap-5">
          <h2 className="shrink-0 text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[42px]">
            Our Partners
          </h2>
          <div className="h-px w-full bg-[rgba(0,0,0,0.08)]" />
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {landingAssets.partners.map((logoPath, index) => (
            <div
              key={logoPath}
              className="relative h-36 overflow-hidden rounded-full border border-cm-border-light bg-white px-6 shadow-[0_6px_16px_rgba(0,0,0,0.04)]"
            >
              <Image
                src={logoPath}
                alt={`Partner ${index + 1}`}
                fill
                className="object-contain p-8"
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 100vw"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

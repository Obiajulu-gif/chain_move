import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AboutChainMoveSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="relative h-[380px] overflow-hidden rounded-3xl bg-[#d8d8d8] sm:h-[430px] lg:h-[520px]">
            <Image src={landingAssets.about.sectionImage} alt="About ChainMove" fill className="object-cover" />
          </div>

          <div className="max-w-[630px]">
            <p className="text-[15px] font-medium text-[#666]">Earn from Transport Assets</p>
            <h2 className="mt-3 text-[28px] sm:text-[32px] font-bold leading-[1.03] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              About <span className="text-cm-orange">Chainmove</span>
            </h2>

            <p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              ChainMove is building a structured mobility investment system for South East Nigeria. Transport is one of
              the most consistent cash-flow sectors in the region. Yet ownership remains fragmented and informal. We
              bring structure, transparency, and technology into everyday mobility.
            </p>

            <p className="mt-8 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              <span className="font-semibold text-cm-orange">Our mission is simple:</span>
              <br />
              Enable disciplined investors to co-own productive transport assets while helping drivers build ownership
              responsibly.
            </p>

            <Link
              href="/about"
              className="mt-12 inline-flex items-center gap-3 text-[17px] sm:text-[20px] font-semibold text-[#212121] transition-colors hover:text-cm-orange"
            >
              Learn More
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ReadyToJoinSection() {
  return (
    <section className="bg-black py-20 md:py-24">
      <Container>
        <h2 className="text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[42px]">
          Ready to <span className="text-cm-orange">Join ChainMove?</span>
        </h2>

        <div className="mt-8 grid items-center gap-8 rounded-3xl bg-white px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1fr_360px] lg:px-10">
          <div>
            <h3 className="text-[28px] sm:text-[32px] font-semibold leading-[1.04] tracking-[-0.02em] text-[#1f1f1f] md:text-[40px]">
              <span className="text-cm-orange">Invest in Mobility.</span> Track From Anywhere.
            </h3>
            <p className="mt-5 text-[17px] sm:text-[20px] leading-[1.2] text-[#626262]">
              Own income-generating transport assets without managing drivers yourself.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth?role=investor"
                className="inline-flex items-center justify-center rounded-full bg-cm-orange px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#de6805]"
              >
                Become a Founding Investor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-[#333] px-6 py-3.5 text-[16px] font-semibold text-[#1f1f1f] transition-colors hover:bg-black/5"
              >
                Schedule a Private Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[220px] w-full max-w-[350px] sm:h-[260px] md:h-[320px]">
            <Image
              src={landingAssets.vehicles.cta}
              alt="ChainMove vehicle"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 320px, 70vw"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

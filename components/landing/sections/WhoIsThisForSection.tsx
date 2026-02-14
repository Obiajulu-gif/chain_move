import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const audiences = [
  "Transport union leaders expanding fleets",
  "Local business owners seeking structured returns",
  "Diaspora Nigerians investing back home",
  "Mobility entrepreneurs scaling assets",
]

export function WhoIsThisForSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-cm-border-light bg-[#d8d8d8] sm:h-[440px] lg:h-[560px]">
            <Image
              src={landingAssets.whoIsThisFor}
              alt="Target audiences"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>

          <div className="max-w-[650px]">
            <p className="text-[15px] font-medium text-[#666]">Target Audiences</p>
            <h2 className="mt-2 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              Who is This For?
            </h2>

            <ul className="mt-6 space-y-1 text-[20px] sm:text-[20px] leading-[1.08] text-[#6f6f6f]">
              {audiences.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#6f6f6f]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[18px] sm:text-[22px] leading-[1.15] text-[#6f6f6f]">
              If you understand transport, you understand this opportunity.
            </p>

            <Link
              href="#"
              className="mt-9 inline-flex items-center rounded-full border border-[#2b2b2b] px-7 py-3.5 text-[16px] sm:text-[18px] font-semibold text-[#232323] transition-colors hover:bg-black/5"
            >
              Check Eligibility
              <ChevronRight className="ml-2.5 h-6 w-6" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

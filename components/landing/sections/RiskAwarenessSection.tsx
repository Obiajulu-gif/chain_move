import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const riskMitigation = ["Driver vetting", "Insured vehicles", "Structured payment plans", "Diversified asset pools"]

export function RiskAwarenessSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="max-w-[650px]">
            <p className="text-[15px] font-medium text-[#666]">Risk Disclosure</p>
            <h2 className="mt-2 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              Built With <span className="text-cm-orange">Risk Awareness</span>
            </h2>

            <p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              Transport operations carry operational risk.
              <br />
              Capital is deployed with discipline, not assumptions.
            </p>

            <p className="mt-7 text-[18px] sm:text-[20px] font-semibold leading-none text-cm-orange">We mitigate this through:</p>
            <ul className="mt-2 space-y-1 text-[20px] sm:text-[20px] leading-[1.08] text-[#6f6f6f]">
              {riskMitigation.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#6f6f6f]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="#"
              className="mt-9 inline-flex items-center rounded-full border border-[#3a3a3a] px-7 py-3.5 text-[16px] sm:text-[18px] font-semibold text-[#232323] transition-colors hover:bg-black/5"
            >
              Review Risk Framework
              <ArrowRight className="ml-2.5 h-6 w-6" />
            </Link>
          </div>

          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-cm-border-light bg-[#d8d8d8] sm:h-[440px] lg:h-[560px]">
            <Image src={landingAssets.riskAwareness} alt="Risk framework visual" fill className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  )
}

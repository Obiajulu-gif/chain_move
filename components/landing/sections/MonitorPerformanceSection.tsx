import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import Image from "next/image"

export function MonitorPerformanceSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.12fr] lg:gap-16">
          <div>
            <p className="text-[15px] font-medium text-[#666]">Live Visibility</p>
            <h2 className="mt-2 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              Monitor Performance From Anywhere
            </h2>
            <p className="mt-6 max-w-[670px] text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              Access your dashboard to track payments, monitor asset utilization, and review earnings in real time. You
              always know how your transport assets are performing.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-cm-border-light bg-[#f4f4f4] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:p-6">
            <div className="relative h-[320px] overflow-hidden rounded-[22px] bg-[#d7d7d7] sm:h-[420px] lg:h-[460px]">
              <Image
                src={landingAssets.dashboard}
                alt="ChainMove dashboard"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

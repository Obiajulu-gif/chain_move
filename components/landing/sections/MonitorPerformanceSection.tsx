import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import Image from "next/image"

export function MonitorPerformanceSection() {
  return (
    <section className="bg-[#f7f7f7] py-20 md:py-24">
      <Container>
        <div className="max-w-[760px]">
          <p className="text-[15px] font-medium uppercase tracking-wide text-[#7a7a7a]">Live Visibility</p>
          <h2 className="mt-2 text-[32px] font-bold leading-[1.02] tracking-[-0.03em] md:text-[52px]">
            <span className="block text-[#5f5f5f]">Monitor Performance</span>
            <span className="block text-cm-orange">From Anywhere</span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.35] text-[#6f6f6f] sm:text-[19px]">
            Access your dashboard to track payments, monitor asset utilization, and review earnings in real time. You
            always know how your transport assets are performing.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-cm-border-light bg-white p-3 shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:p-4 md:mt-12 md:p-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#ececec] md:aspect-[16/9]">
            <Image
              src={landingAssets.monitorDashboard}
              alt="ChainMove investor performance dashboard"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1280px) 1180px, (min-width: 1024px) 92vw, 100vw"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Hero } from "@/components/landing/Hero"
import { AboutChainMoveSection } from "@/components/landing/sections/AboutChainMoveSection"
import { HowItWorksSection } from "@/components/landing/sections/HowItWorksSection"
import { MonitorPerformanceSection } from "@/components/landing/sections/MonitorPerformanceSection"
import { ReadyToJoinSection } from "@/components/landing/sections/ReadyToJoinSection"
import { RiskAwarenessSection } from "@/components/landing/sections/RiskAwarenessSection"
import { VehicleOptionsSection } from "@/components/landing/sections/VehicleOptionsSection"
import { WhoIsThisForSection } from "@/components/landing/sections/WhoIsThisForSection"
import { WhyInvestSection } from "@/components/landing/sections/WhyInvestSection"
import { MotionSection } from "@/components/motion/motion-section"

const FAQSection = dynamic(() => import("@/components/landing/sections/FAQSection").then((mod) => mod.FAQSection))
const PartnersSection = dynamic(() => import("@/components/landing/sections/PartnersSection").then((mod) => mod.PartnersSection))

export const metadata: Metadata = {
  title: "Investor",
  description:
    "Invest in insured mobility assets with transparent tracking, structured payouts, and real-world vehicle financing opportunities.",
  openGraph: {
    title: "ChainMove | Investor",
    description:
      "Invest in insured mobility assets with transparent tracking, structured payouts, and real-world vehicle financing opportunities.",
  },
  twitter: {
    title: "ChainMove | Investor",
    description:
      "Invest in insured mobility assets with transparent tracking, structured payouts, and real-world vehicle financing opportunities.",
  },
}

export default function InvestorLandingPage() {
  return (
    <>
      <Hero
        variant="investor"
        titlePrimary="Invest Locally."
        titleAccent="Monitor Globally."
        description="Invest in insured mobility assets across South East Nigeria and monitor your returns in real time from anywhere in the world."
        primaryCtaLabel="Invest Now!"
        primaryCtaHref="/auth?role=investor"
        secondaryCtaLabel="View Opportunities"
        secondaryCtaHref="#how-it-works"
      />
      <MotionSection as="div">
        <AboutChainMoveSection />
      </MotionSection>
      <MotionSection as="div">
        <HowItWorksSection />
      </MotionSection>
      <MotionSection as="div">
        <MonitorPerformanceSection />
      </MotionSection>
      <MotionSection as="div">
        <RiskAwarenessSection />
      </MotionSection>
      <MotionSection as="div">
        <WhoIsThisForSection />
      </MotionSection>
      <MotionSection as="div">
        <VehicleOptionsSection />
      </MotionSection>
      <MotionSection as="div">
        <WhyInvestSection />
      </MotionSection>
      <MotionSection as="div">
        <FAQSection />
      </MotionSection>
      <MotionSection as="div">
        <PartnersSection />
      </MotionSection>
      <MotionSection as="div">
        <ReadyToJoinSection />
      </MotionSection>
    </>
  )
}

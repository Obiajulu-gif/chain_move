import { Hero } from "@/components/landing/Hero"
import { AboutChainMoveSection } from "@/components/landing/sections/AboutChainMoveSection"
import { FAQSection } from "@/components/landing/sections/FAQSection"
import { HowItWorksSection } from "@/components/landing/sections/HowItWorksSection"
import { MonitorPerformanceSection } from "@/components/landing/sections/MonitorPerformanceSection"
import { PartnersSection } from "@/components/landing/sections/PartnersSection"
import { ReadyToJoinSection } from "@/components/landing/sections/ReadyToJoinSection"
import { RiskAwarenessSection } from "@/components/landing/sections/RiskAwarenessSection"
import { VehicleOptionsSection } from "@/components/landing/sections/VehicleOptionsSection"
import { WhoIsThisForSection } from "@/components/landing/sections/WhoIsThisForSection"
import { WhyInvestSection } from "@/components/landing/sections/WhyInvestSection"

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
      <AboutChainMoveSection />
      <HowItWorksSection />
      <MonitorPerformanceSection />
      <RiskAwarenessSection />
      <WhoIsThisForSection />
      <VehicleOptionsSection />
      <WhyInvestSection />
      <FAQSection />
      <PartnersSection />
      <ReadyToJoinSection />
    </>
  )
}

import { Hero } from "@/components/landing/Hero"
import { BuiltForDriversSection } from "@/components/landing/sections/BuiltForDriversSection"
import { ClearPathToOwnershipSection } from "@/components/landing/sections/ClearPathToOwnershipSection"
import { FAQSection } from "@/components/landing/sections/FAQSection"
import { PartnersSection } from "@/components/landing/sections/PartnersSection"
import { ReadyToJoinSection } from "@/components/landing/sections/ReadyToJoinSection"
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection"
import { TrackProgressSection } from "@/components/landing/sections/TrackProgressSection"
import { VehicleOptionsSection } from "@/components/landing/sections/VehicleOptionsSection"
import { WhyDriveSection } from "@/components/landing/sections/WhyDriveSection"
import { WhyInvestSection } from "@/components/landing/sections/WhyInvestSection"

export default function DriverLandingPage() {
  return (
    <>
      <Hero
        variant="driver"
        titlePrimary="Drive. Earn."
        titleAccent="Own."
        description="Join ChainMove's structured pay-to-own program and turn your daily driving into vehicle ownership."
        primaryCtaLabel="Apply as a Driver"
        primaryCtaHref="/auth?role=driver"
        secondaryCtaLabel="Speak to Us"
        secondaryCtaHref="#"
      />
      <BuiltForDriversSection />
      <ClearPathToOwnershipSection />
      <TrackProgressSection />
      <WhyDriveSection />
      <VehicleOptionsSection />
      <WhyInvestSection />
      <FAQSection />
      <PartnersSection />
      <TestimonialsSection />
      <ReadyToJoinSection />
    </>
  )
}

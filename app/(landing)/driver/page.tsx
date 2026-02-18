import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Hero } from "@/components/landing/Hero"
import { BuiltForDriversSection } from "@/components/landing/sections/BuiltForDriversSection"
import { ClearPathToOwnershipSection } from "@/components/landing/sections/ClearPathToOwnershipSection"
import { ReadyToJoinSection } from "@/components/landing/sections/ReadyToJoinSection"
import { TrackProgressSection } from "@/components/landing/sections/TrackProgressSection"
import { VehicleOptionsSection } from "@/components/landing/sections/VehicleOptionsSection"
import { WhyDriveSection } from "@/components/landing/sections/WhyDriveSection"
import { WhyInvestSection } from "@/components/landing/sections/WhyInvestSection"
import { MotionSection } from "@/components/motion/motion-section"

const FAQSection = dynamic(() => import("@/components/landing/sections/FAQSection").then((mod) => mod.FAQSection))
const PartnersSection = dynamic(() => import("@/components/landing/sections/PartnersSection").then((mod) => mod.PartnersSection))
const TestimonialsSection = dynamic(
  () => import("@/components/landing/sections/TestimonialsSection").then((mod) => mod.TestimonialsSection),
)

export const metadata: Metadata = {
  title: "Driver",
  description:
    "Join ChainMove's structured pay-to-own driver program, track progress in real time, and build vehicle ownership with transparent terms.",
  openGraph: {
    title: "ChainMove | Driver",
    description:
      "Join ChainMove's structured pay-to-own driver program, track progress in real time, and build vehicle ownership with transparent terms.",
  },
  twitter: {
    title: "ChainMove | Driver",
    description:
      "Join ChainMove's structured pay-to-own driver program, track progress in real time, and build vehicle ownership with transparent terms.",
  },
}

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
        secondaryCtaHref="https://calendly.com/okoyeemmanuelobiajulu/replas"
      />
      <MotionSection as="div">
        <BuiltForDriversSection />
      </MotionSection>
      <MotionSection as="div">
        <ClearPathToOwnershipSection />
      </MotionSection>
      <MotionSection as="div">
        <TrackProgressSection />
      </MotionSection>
      <MotionSection as="div">
        <WhyDriveSection />
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
        <TestimonialsSection />
      </MotionSection>
      <MotionSection as="div">
        <ReadyToJoinSection />
      </MotionSection>
    </>
  )
}

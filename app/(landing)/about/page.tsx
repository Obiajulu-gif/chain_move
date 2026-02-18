import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { CoreValuesSection } from "@/components/landing/sections/CoreValuesSection"
import { JourneyMilestonesSection } from "@/components/landing/sections/JourneyMilestonesSection"
import { RegisteredCompanySection } from "@/components/landing/sections/RegisteredCompanySection"
import { ReadyToJoinSection } from "@/components/landing/sections/ReadyToJoinSection"
import { WhatSetsUsApartSection } from "@/components/landing/sections/WhatSetsUsApartSection"
import { WhyWeExistStatementSection } from "@/components/landing/sections/WhyWeExistStatementSection"
import { WhyWeExistStorySection } from "@/components/landing/sections/WhyWeExistStorySection"
import { MotionSection } from "@/components/motion/motion-section"

const FAQSection = dynamic(() => import("@/components/landing/sections/FAQSection").then((mod) => mod.FAQSection))
const PartnersSection = dynamic(() => import("@/components/landing/sections/PartnersSection").then((mod) => mod.PartnersSection))
const TestimonialsSection = dynamic(
  () => import("@/components/landing/sections/TestimonialsSection").then((mod) => mod.TestimonialsSection),
)

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why ChainMove exists, what sets us apart, our core values, and the milestones behind our mobility financing mission.",
  openGraph: {
    title: "ChainMove | About",
    description:
      "Learn why ChainMove exists, what sets us apart, our core values, and the milestones behind our mobility financing mission.",
  },
  twitter: {
    title: "ChainMove | About",
    description:
      "Learn why ChainMove exists, what sets us apart, our core values, and the milestones behind our mobility financing mission.",
  },
}

export default function AboutLandingPage() {
  return (
    <>
      <MotionSection as="div">
        <WhyWeExistStatementSection />
      </MotionSection>
      <MotionSection as="div">
        <WhyWeExistStorySection />
      </MotionSection>
      <MotionSection as="div">
        <RegisteredCompanySection />
      </MotionSection>
      <MotionSection as="div">
        <WhatSetsUsApartSection />
      </MotionSection>
      <MotionSection as="div">
        <CoreValuesSection />
      </MotionSection>
      <MotionSection as="div">
        <JourneyMilestonesSection />
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

import { FAQSection } from "@/components/landing/sections/FAQSection"
import { PartnersSection } from "@/components/landing/sections/PartnersSection"
import { ReadyToJoinSection } from "@/components/landing/sections/ReadyToJoinSection"
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection"
import { WhyWeExistStatementSection } from "@/components/landing/sections/WhyWeExistStatementSection"
import { WhyWeExistStorySection } from "@/components/landing/sections/WhyWeExistStorySection"

export default function AboutLandingPage() {
  return (
    <>
      <WhyWeExistStatementSection />
      <WhyWeExistStorySection />
      <FAQSection />
      <PartnersSection />
      <TestimonialsSection />
      <ReadyToJoinSection />
    </>
  )
}

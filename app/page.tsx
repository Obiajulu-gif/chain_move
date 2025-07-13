"use client"

import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { CoOwnershipSection } from "@/components/landing/co-ownership-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturedVehiclesSection } from "@/components/landing/featured-vehicles-section"
import { FAQSection } from "@/components/landing/faq-section"
import { PartnersSection } from "@/components/landing/partners-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <HeroSection />
            <StatsSection />
            <CoOwnershipSection />
            <HowItWorksSection />
            <FeaturedVehiclesSection />
            <TestimonialsSection />
            <PartnersSection />
            <FAQSection />
          </main>
          <Footer />
    </div>
  )
}

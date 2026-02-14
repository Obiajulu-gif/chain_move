import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function WhyWeExistStorySection() {
  return (
    <section className="bg-[#f2f2f2] py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="relative h-[380px] overflow-hidden rounded-3xl border border-cm-border-light bg-[#d8d8d8] sm:h-[430px] lg:h-[520px]">
            <Image
              src={landingAssets.about.storyImage}
              alt="Our story"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>

          <div>
            <p className="text-[15px] font-medium uppercase tracking-wide text-[#666]">Our Story</p>
            <h2 className="mt-2 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              Why We Exist.
            </h2>

            <p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              For years, drivers have worked tirelessly under daily settlement systems that rarely lead to ownership. At
              the same time, mobility entrepreneurs and diaspora investors have lacked structured and transparent
              pathways to participate in transport assets without directly managing vehicles themselves.
            </p>

            <p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              We saw an opportunity to organize what already works. ChainMove bridges this gap by creating a disciplined
              system where drivers operate under clear pay to own agreements and investors participate through
              fractional ownership of insured transport assets.
            </p>

            <Link
              href="#"
              className="mt-10 inline-flex items-center gap-3 text-[17px] sm:text-[20px] font-semibold text-[#212121] transition-colors hover:text-cm-orange"
            >
              Learn More
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:gap-10">
          <h3 className="text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[38px]">
            <span className="text-cm-orange">Why</span> We Exist?
          </h3>

          <div className="space-y-12">
            <div className="border-b border-black/10 pb-10">
              <p className="text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
                For years, drivers have worked tirelessly under daily settlement systems that rarely lead to ownership.
                At the same time, mobility entrepreneurs and diaspora investors have lacked structured and transparent
                pathways to participate in transport assets without directly managing vehicles themselves.
              </p>
              <p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
                We saw an opportunity to organize what already works. ChainMove bridges this gap by creating a
                disciplined system where drivers operate under clear pay to own agreements and investors participate
                through fractional ownership of insured transport assets.
              </p>
            </div>

            <div className="border-b border-black/10 pb-10">
              <h4 className="text-[26px] sm:text-[30px] font-semibold leading-[1.05] text-cm-orange">The Goal</h4>
              <p className="mt-5 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
                Build a transport ownership model that is simple enough for drivers, structured enough for investors,
                and resilient enough for long-term regional mobility growth.
              </p>
            </div>

            <div>
              <h4 className="text-[26px] sm:text-[30px] font-semibold leading-[1.05] text-cm-orange">The Region</h4>
              <p className="mt-5 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
                We focus on South East Nigeria where transport is active, demand is constant, and disciplined ownership
                pathways can produce measurable economic impact.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

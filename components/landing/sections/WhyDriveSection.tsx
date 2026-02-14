"use client"

import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { cn } from "@/lib/utils"
import { CircleDot, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const items = [
  {
    title: "Insured & Protected Vehicles",
    body: "Drive with confidence knowing your vehicle comes with proper documentation, active insurance, and structured support.",
  },
  {
    title: "Clear Path to Ownership",
    body: "Your daily payments follow a transparent schedule that moves you progressively toward full ownership.",
  },
  {
    title: "Local Support & Trust",
    body: "You get real local onboarding, verification, and support throughout your ownership journey.",
  },
  {
    title: "Clear Payment Plan",
    body: "No hidden deductions. No confusing remittance structure. You know exactly what goes toward ownership.",
  },
]

export function WhyDriveSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-cm-border-light bg-[#d8d8d8] sm:h-[440px] lg:h-[560px]">
            <Image src={landingAssets.whyDrive} alt="Why drive with ChainMove" fill className="object-cover" />
          </div>

          <div>
            <p className="inline-flex items-center rounded-full border border-cm-orange px-3 py-1 text-[16px] text-cm-orange">
              <CircleDot className="mr-2 h-4 w-4" />
              Benefits
            </p>

            <h2 className="mt-4 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
              Why Drive With <span className="text-cm-orange">Chainmove?</span>
            </h2>

            <p className="mt-5 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
              ChainMove was built to replace daily settlement stress with structure and transparency. We combine steady
              weekly earnings, gradual ownership, and local support to give drivers a clear path toward long term
              stability.
            </p>

            <div className="mt-8 divide-y divide-black/10 rounded-3xl border border-cm-border-light bg-white">
              {items.map((item, index) => {
                const isOpen = openIndex === index
                const panelId = `why-drive-panel-${index}`

                return (
                  <article key={item.title} className="px-5 py-2 md:px-6">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="text-[20px] sm:text-[18px] font-semibold leading-[1.1] text-[#6c2b04]">{item.title}</span>
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#283047]">
                          {isOpen ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        </span>
                      </button>
                    </h3>

                    <div id={panelId} hidden={!isOpen} className={cn("pb-5", !isOpen && "pb-0")}>
                      <p className="text-[16px] sm:text-[18px] leading-[1.2] text-[#6f6f6f]">{item.body}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

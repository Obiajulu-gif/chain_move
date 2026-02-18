"use client"

import { Container } from "@/components/landing/Container"
import { MotionStagger, MotionStaggerItem } from "@/components/motion/motion-stagger"
import { cn } from "@/lib/utils"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"

const faqItems = [
  {
    question: "What exactly am I investing in?",
    answer:
      "You are investing in insured, income-generating transport assets placed on structured pay-to-own agreements with vetted drivers.",
  },
  {
    question: "How are returns generated?",
    answer:
      "Returns come from weekly driver payments tied to transport usage. Distributions are tracked transparently through the ChainMove system.",
  },
  {
    question: "What happens if a driver defaults?",
    answer:
      "Each asset is covered by risk controls that include driver vetting, insurance layers, and operational intervention to protect capital.",
  },
  {
    question: "Who manages the vehicles and drivers?",
    answer:
      "ChainMove handles onboarding, compliance, monitoring, and performance management so investors do not have to manage operations directly.",
  },
  {
    question: "Is this cryptocurrency speculation?",
    answer:
      "No. The model is tied to real transport assets and real repayment cash flow, not token price speculation.",
  },
]

interface FAQSectionProps {
  title?: string
  id?: string
}

export function FAQSection({ title = "Frequently Asked Questions", id = "faqs" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id={id} className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.45fr] lg:gap-12">
          <h2 className="max-w-[420px] text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[42px]">
            {title}
          </h2>

          <MotionStagger className="space-y-3" stagger={0.07}>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index
              const panelId = `faq-panel-${index}`

              return (
                <MotionStaggerItem key={item.question}>
                  <article
                    className={cn(
                      "rounded-2xl border border-cm-border-light bg-white transition-colors",
                      isOpen ? "bg-[#fcf7f4]" : "bg-white",
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6 md:py-6"
                      >
                        <span className="text-[18px] sm:text-[20px] font-medium leading-[1.2] text-[#1f1f1f]">{item.question}</span>
                        <m.span
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cm-orange text-white"
                          aria-hidden="true"
                          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Plus className="h-5 w-5" />
                        </m.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <m.div
                          id={panelId}
                          initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0.15 : 0.3, ease: "easeOut" }}
                          className="overflow-hidden px-5 md:px-6"
                        >
                          <p className="max-w-[760px] pb-6 text-[16px] sm:text-[18px] leading-[1.55] text-[#6f6f6f]">{item.answer}</p>
                        </m.div>
                      ) : null}
                    </AnimatePresence>
                  </article>
                </MotionStaggerItem>
              )
            })}
          </MotionStagger>
        </div>
      </Container>
    </section>
  )
}

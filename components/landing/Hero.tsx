"use client"

import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { m, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type HeroVariant = "investor" | "driver" | "about"

interface HeroProps {
  variant: HeroVariant
  titlePrimary: string
  titleAccent: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

const isExternalLink = (href: string) => href.startsWith("https://") || href.startsWith("http://")

export function Hero({
  variant,
  titlePrimary,
  titleAccent,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion()
  const isAbout = variant === "about"
  const videoSrc = variant === "investor" ? landingAssets.heroVideos.investor : landingAssets.heroVideos.driver
  const primaryExternal = isExternalLink(primaryCtaHref)
  const secondaryExternal = isExternalLink(secondaryCtaHref)
  const fadeInUpInitial = shouldReduceMotion ? false : { opacity: 0, y: 12 }
  const fadeInUpAnimate = shouldReduceMotion ? {} : { opacity: 1, y: 0 }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-cm-dark">
      <div className="absolute inset-0">
        {isAbout ? (
          <Image
            src={landingAssets.heroImages.about}
            alt="About hero"
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover"
            sizes="100vw"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,15,15,0.92)_0%,rgba(15,15,15,0.68)_45%,rgba(15,15,15,0.52)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.68)_100%)]" />

      <Container className="relative z-10 flex min-h-screen items-center pb-16 pt-32 md:pb-20 md:pt-36">
        <div className="max-w-[700px]">
          <m.h1
            className="text-balance text-[34px] font-bold leading-[0.98] tracking-[-0.035em] text-cm-text sm:text-[48px] md:text-[60px] lg:text-[72px]"
            initial={fadeInUpInitial}
            animate={fadeInUpAnimate}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block">{titlePrimary}</span>
            <span className="block text-cm-orange">{titleAccent}</span>
          </m.h1>

          <m.p
            className="mt-5 max-w-[620px] text-[16px] leading-[1.5] text-white/90 sm:text-[18px] md:text-[21px]"
            initial={fadeInUpInitial}
            animate={fadeInUpAnimate}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {description}
          </m.p>

          <m.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.14,
                },
              },
            }}
          >
            <m.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={primaryCtaHref}
                target={primaryExternal ? "_blank" : undefined}
                rel={primaryExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-full bg-cm-orange px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#de6805] sm:px-8 sm:text-[16px]"
              >
                {primaryCtaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </m.div>

            <m.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={secondaryCtaHref}
                target={secondaryExternal ? "_blank" : undefined}
                rel={secondaryExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-black/20 px-7 py-3 text-[14px] font-semibold text-cm-text backdrop-blur-sm transition-colors hover:bg-black/35 sm:px-8 sm:text-[16px]"
              >
                {secondaryCtaLabel}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </m.div>
          </m.div>
        </div>
      </Container>
    </section>
  )
}

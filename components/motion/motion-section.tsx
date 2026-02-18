"use client"

import type { ReactNode } from "react"
import { m, type HTMLMotionProps, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

type MotionSectionElement = "section" | "div" | "article"

interface MotionSectionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  as?: MotionSectionElement
  children: ReactNode
  offsetY?: number
  duration?: number
  delay?: number
  once?: boolean
  amount?: number
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const MOTION_TAGS = {
  section: m.section,
  div: m.div,
  article: m.article,
} as const

export function MotionSection({
  as = "section",
  children,
  className,
  offsetY = 12,
  duration = 0.6,
  delay = 0,
  once = true,
  amount = 0.2,
  ...props
}: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = MOTION_TAGS[as]

  if (shouldReduceMotion) {
    return (
      <MotionTag className={cn(className)} {...props}>
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: offsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

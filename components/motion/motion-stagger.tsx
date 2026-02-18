"use client"

import type { ReactNode } from "react"
import { m, type HTMLMotionProps, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface MotionStaggerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  stagger?: number
  delayChildren?: number
  once?: boolean
  amount?: number
}

interface MotionStaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  offsetY?: number
  duration?: number
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function MotionStagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
  amount = 0.2,
  ...props
}: MotionStaggerProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <m.div className={cn(className)} {...props}>
        {children}
      </m.div>
    )
  }

  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </m.div>
  )
}

export function MotionStaggerItem({
  children,
  className,
  offsetY = 12,
  duration = 0.55,
  ...props
}: MotionStaggerItemProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <m.div className={cn(className)} {...props}>
        {children}
      </m.div>
    )
  }

  return (
    <m.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: offsetY },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </m.div>
  )
}

"use client"

import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { startTransition, useEffect, useMemo, useRef, useState } from "react"

const INTEREST_RATE = 34.36
const DURATION_WEEKS = 80
const AUTO_PLAY_INTERVAL_MS = 1800
const AUTO_PLAY_RESUME_DELAY_MS = 6000

const SIMULATOR_STEPS = [
  { totalReturn: 1_477_960, initialDeposit: 1_100_000 },
  { totalReturn: 2_955_920, initialDeposit: 2_200_000 },
  { totalReturn: 4_433_880, initialDeposit: 3_300_000 },
  { totalReturn: 5_911_840, initialDeposit: 4_400_000 },
  { totalReturn: 6_852_360, initialDeposit: 5_500_000 },
  { totalReturn: 8_330_320, initialDeposit: 6_600_000 },
  { totalReturn: 9_808_280, initialDeposit: 7_700_000 },
  { totalReturn: 11_286_240, initialDeposit: 8_800_000 },
  { totalReturn: 12_226_760, initialDeposit: 9_900_000 },
  { totalReturn: 13_704_720, initialDeposit: 11_000_000 },
].map((entry) => ({
  ...entry,
  earned: entry.totalReturn - entry.initialDeposit,
}))

const CHART_HEIGHT = 340
const CHART_WIDTH = 520
const CHART_POINTS = [
  { x: 0, y: 230 },
  { x: 56, y: 188 },
  { x: 116, y: 148 },
  { x: 172, y: 170 },
  { x: 224, y: 127 },
  { x: 282, y: 98 },
  { x: 344, y: 140 },
  { x: 402, y: 120 },
  { x: 458, y: 154 },
  { x: 520, y: 24 },
]

function formatNaira(value: number) {
  return `₦${new Intl.NumberFormat("en-NG").format(Math.round(value))}`
}

function useAnimatedValue(target: number, duration = 550) {
  const [value, setValue] = useState(target)
  const valueRef = useRef(target)

  useEffect(() => {
    let frameId = 0
    const startedAt = performance.now()
    const initialValue = valueRef.current

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const nextValue = initialValue + (target - initialValue) * easedProgress

      valueRef.current = nextValue
      setValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      } else {
        valueRef.current = target
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [duration, target])

  return value
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) {
    return ""
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const controlX = (previous.x + current.x) / 2

    path += ` C ${controlX} ${previous.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`
  }

  return path
}

export function InvestmentReturnsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const resumeTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const isInView = useInView(sectionRef, { amount: 0.35, once: false })
  const [stepIndex, setStepIndex] = useState(0)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)

  const currentStep = SIMULATOR_STEPS[stepIndex]
  const totalReturn = useAnimatedValue(currentStep.totalReturn)
  const earned = useAnimatedValue(currentStep.earned)
  const initialDeposit = useAnimatedValue(currentStep.initialDeposit)
  const chartPath = useMemo(() => buildSmoothPath(CHART_POINTS), [])
  const activePoint = CHART_POINTS[stepIndex]

  useEffect(() => {
    if (!isInView || !autoPlayEnabled) {
      return
    }

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setStepIndex((previous) => (previous + 1) % SIMULATOR_STEPS.length)
      })
    }, AUTO_PLAY_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [autoPlayEnabled, isInView])

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  const handleSliderChange = (values: number[]) => {
    const nextIndex = values[0] ?? 0

    setStepIndex(nextIndex)
    setAutoPlayEnabled(false)

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setAutoPlayEnabled(true)
    }, AUTO_PLAY_RESUME_DELAY_MS)
  }

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] border border-[#e7ddd3] bg-[#f7f2ed] px-5 py-8 shadow-[0_24px_80px_rgba(108,43,4,0.08)] sm:px-7 md:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,125,0,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,125,0,0.09),_transparent_36%)]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-8">
            <div className="max-w-[530px]">
              <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-[#9f6a3f]">Investment Preview</p>
              <h2 className="mt-4 text-[34px] font-bold leading-[0.98] tracking-[-0.05em] text-[#6c2b04] sm:text-[44px]">
                See How Much
                <br />
                Your Investment Can Earn
              </h2>
              <p className="mt-4 max-w-[430px] text-[15px] leading-[1.35] text-[#6f6a65] sm:text-[17px]">
                Use our earnings simulator to estimate your potential returns from owning a transport asset before you invest.
              </p>

              <motion.div
                key={stepIndex}
                initial={{ opacity: 0.6, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-8"
              >
                <div className="text-[40px] font-bold leading-none tracking-[-0.05em] text-cm-orange sm:text-[56px]">
                  {formatNaira(totalReturn)}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3 text-[16px] text-[#6f6a65]">
                  <span className="font-semibold text-[#333]">{formatNaira(earned)}</span>
                  <span>Earned in</span>
                  <div className="inline-flex min-h-9 items-center rounded-lg border border-[#ddd0c3] bg-white px-3 text-[14px] font-medium text-[#7d6d5e] shadow-sm">
                    {DURATION_WEEKS} Weeks
                  </div>
                </div>
              </motion.div>

              <div className="mt-8 rounded-[24px] border border-[#ece2d7] bg-white p-4 shadow-[0_12px_34px_rgba(108,43,4,0.08)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#2d2d2d]">Initial Deposit</p>
                    <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-[#3a3a3a]">
                      {formatNaira(initialDeposit)}
                    </p>
                  </div>
                  <div className="inline-flex min-h-10 items-center rounded-lg border border-[#ddd0c3] bg-[#fcfaf8] px-3 text-[13px] font-medium text-[#7d6d5e]">
                    Naira (₦)
                  </div>
                </div>

                <div className="mt-5">
                  <SliderPrimitive.Root
                    value={[stepIndex]}
                    min={0}
                    max={SIMULATOR_STEPS.length - 1}
                    step={1}
                    aria-label="Initial deposit range"
                    onValueChange={handleSliderChange}
                    className="relative flex h-9 w-full touch-none select-none items-center"
                  >
                    <SliderPrimitive.Track className="relative h-[10px] w-full grow overflow-hidden rounded-full bg-[#eef1f3]">
                      <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#ff7d00] to-[#ff5a00]" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border border-[#e8ded5] bg-white shadow-[0_10px_24px_rgba(108,43,4,0.18)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7d00]/40" />
                  </SliderPrimitive.Root>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-[#b19376]">
                    <span>{formatNaira(SIMULATOR_STEPS[0].initialDeposit)}</span>
                    <span>{formatNaira(SIMULATOR_STEPS[SIMULATOR_STEPS.length - 1].initialDeposit)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] text-[#6f6a65]">
                <span>Interest Rate:</span>
                <span className="font-semibold text-[#333]">{INTEREST_RATE}%</span>
                <span>over</span>
                <span className="font-semibold text-[#333]">{DURATION_WEEKS} weeks</span>
              </div>
            </div>

            <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[520px]">
              <div className="absolute inset-x-6 top-3 h-24 rounded-full bg-[#ff8a1f]/10 blur-3xl sm:inset-x-14" />

              <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="absolute inset-x-0 top-6 h-[68%] w-full overflow-visible sm:h-[72%] lg:top-10"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="earnings-line" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#ff8a1f" stopOpacity="0.55" />
                    <stop offset="40%" stopColor="#ff6b00" />
                    <stop offset="100%" stopColor="#ff6b00" stopOpacity="0.95" />
                  </linearGradient>
                  <filter id="earnings-glow">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path d={chartPath} fill="none" stroke="url(#earnings-line)" strokeWidth="4" strokeLinecap="round" />
                <motion.circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="9"
                  fill="#ff6b00"
                  filter="url(#earnings-glow)"
                  animate={{ cx: activePoint.x, cy: activePoint.y }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
                <motion.circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="18"
                  fill="rgba(255,107,0,0.16)"
                  animate={{ cx: activePoint.x, cy: activePoint.y }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
              </svg>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute right-[-4%] bottom-0 z-10 w-[92%] max-w-[470px] sm:right-0 sm:w-[85%] lg:w-[92%]"
              >
                <div className="absolute left-[8%] top-[12%] -z-10 h-[52%] w-[58%] rounded-full border-2 border-[#ff7d00]/75" />
                <Image
                  src={landingAssets.earningsSimulatorFigure}
                  alt="Investor preview visual"
                  width={1100}
                  height={900}
                  className="h-auto w-full object-contain drop-shadow-[0_26px_34px_rgba(108,43,4,0.12)]"
                  sizes="(min-width: 1024px) 42vw, (min-width: 640px) 75vw, 92vw"
                  priority={false}
                />
              </motion.div>

              <div className="absolute bottom-6 left-0 z-20 rounded-2xl border border-white/80 bg-white/88 px-4 py-3 shadow-[0_18px_38px_rgba(108,43,4,0.12)] backdrop-blur sm:left-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#b19376]">Live Step</p>
                <p className="mt-1 text-[22px] font-bold tracking-[-0.04em] text-[#6c2b04]">
                  {stepIndex + 1}
                  <span className="text-[15px] font-medium text-[#7d6d5e]"> / {SIMULATOR_STEPS.length}</span>
                </p>
                <p className="mt-1 text-[13px] text-[#6f6a65]">
                  {autoPlayEnabled ? "Auto demo running" : "Paused for manual input"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

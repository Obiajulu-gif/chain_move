"use client"

import { useEffect } from "react"

export function LandingScrollBehavior() {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.dataset.landingScroll
    root.dataset.landingScroll = "smooth"

    return () => {
      if (previous) {
        root.dataset.landingScroll = previous
      } else {
        delete root.dataset.landingScroll
      }
    }
  }, [])

  return null
}


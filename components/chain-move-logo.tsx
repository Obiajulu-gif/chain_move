import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChainMoveLogoProps {
  className?: string
  width?: number
  height?: number
}

export function ChainMoveLogo({ className, width = 32, height = 32 }: ChainMoveLogoProps) {
  return (
    <Image
      src="/images/chainmovelogo.png"
      alt="ChainMove Logo"
      width={width}
      height={height}
      className={cn("object-contain", className)}
    />
  )
}

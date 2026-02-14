import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section"
}

export function Container({ as = "div", className, children, ...props }: ContainerProps) {
  const Comp = as

  return (
    <Comp className={cn("mx-auto w-full max-w-[1200px] px-4 md:px-6", className)} {...props}>
      {children}
    </Comp>
  )
}

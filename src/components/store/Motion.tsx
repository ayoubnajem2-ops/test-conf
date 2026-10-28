import { motion } from "framer-motion"
import type { ReactNode } from "react"

type Tag = "div" | "span" | "p" | "h2" | "li"

// Scroll-in animation: fades, rises and scales gently the first time it enters the screen.
export function Pop({ children, className = "", delay = 0, y = 44, as = "div" }: { children: ReactNode; className?: string; delay?: number; y?: number; as?: Tag }) {
  const M: any = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

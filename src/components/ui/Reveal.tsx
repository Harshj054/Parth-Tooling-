import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT, inView, staggerParent } from '@/lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

/** Fade + rise as it enters the viewport (once). Transform/opacity only. */
export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Parent that reveals its <StaggerItem> children in sequence. */
export function Stagger({
  children,
  className,
  stagger = 0.07,
  delay = 0.04,
}: RevealProps & { stagger?: number }) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, y = 18 }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  )
}

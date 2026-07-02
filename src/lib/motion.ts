import type { Variants } from 'framer-motion'

/**
 * Shared motion vocabulary. All transform/opacity only, so it stays on the
 * compositor thread and never triggers layout. Every consumer is wrapped in
 * <MotionConfig reducedMotion="user">, so these degrade gracefully.
 */

// A crisp, slightly mechanical ease-out — feels engineered, not bouncy.
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_OUT } },
}

/** Parent that staggers its children as they enter the viewport. */
export function staggerParent(stagger = 0.07, delay = 0.04): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }
}

/** Default viewport config for whileInView — reveal once, a bit before fully in. */
export const inView = { once: true, margin: '0px 0px -12% 0px' } as const

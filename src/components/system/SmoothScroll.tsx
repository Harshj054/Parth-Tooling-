import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { setLenis } from '@/lib/lenis'

/**
 * Inertial smooth scrolling (Lenis). This is what makes the scroll-scrubbed
 * video feel fluid — scroll input is eased, so the value driving the video's
 * currentTime changes smoothly instead of in hard steps. Disabled entirely
 * under prefers-reduced-motion (native scrolling takes over).
 */
export function SmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    setLenis(lenis)
    if (import.meta.env.DEV) {
      ;(window as unknown as { lenis?: Lenis }).lenis = lenis
    }

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduce])

  return null
}

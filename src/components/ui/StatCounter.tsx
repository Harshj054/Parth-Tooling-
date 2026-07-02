import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type Props = {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  group?: boolean
  className?: string
}

/** Counts up from 0 to `value` when scrolled into view. Honors reduced motion. */
export function StatCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.4,
  group = true,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    if (reduce) {
      setN(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, value, reduce, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {group ? n.toLocaleString('en-IN') : n}
      {suffix}
    </span>
  )
}

import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const SPARKS = [
  { left: '12%', size: 3, delay: '0s', dur: '3.4s' },
  { left: '24%', size: 2, delay: '1.1s', dur: '2.8s' },
  { left: '38%', size: 2, delay: '2.2s', dur: '3.8s' },
  { left: '57%', size: 3, delay: '0.6s', dur: '3.1s' },
  { left: '70%', size: 2, delay: '1.8s', dur: '4.2s' },
  { left: '83%', size: 3, delay: '2.6s', dur: '3.3s' },
  { left: '91%', size: 2, delay: '0.3s', dur: '2.9s' },
]

/** Ambient ember embers drifting up — the forge, understated. Off for reduced motion. */
export function Sparks({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute bottom-6 rounded-full bg-ember/80 animate-spark-rise"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
            boxShadow: '0 0 6px rgba(255,107,44,0.8)',
          }}
        />
      ))}
    </div>
  )
}

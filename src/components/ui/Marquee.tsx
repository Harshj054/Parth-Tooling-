import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Seamless logo/marquee strip. Two identical tracks translate by -50% for a
 * loop with no seam. Under reduced motion it falls back to a static wrap.
 */
export function Marquee({
  children,
  className,
  speed = 'normal',
}: {
  children: ReactNode
  className?: string
  speed?: 'normal' | 'slow'
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-x-8 gap-y-4', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('mask-fade-x overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max pause-on-hover',
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
        )}
      >
        <div className="flex shrink-0 items-center gap-x-8 pr-8">{children}</div>
        <div className="flex shrink-0 items-center gap-x-8 pr-8" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'steel' | 'arc' | 'ember'

const tones: Record<Tone, string> = {
  steel: 'border-line bg-white/[0.02] text-muted',
  arc: 'border-arc/30 bg-arc/10 text-arc',
  ember: 'border-ember/30 bg-ember/10 text-ember-bright',
}

export function Chip({
  children,
  className,
  tone = 'steel',
}: {
  children: ReactNode
  className?: string
  tone?: Tone
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.68rem] tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

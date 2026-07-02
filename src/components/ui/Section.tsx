import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('eyebrow', className)}>
      <span className="inline-block h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" />
      {children}
    </span>
  )
}

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  /** Adds a faint elevated panel background. */
  tone?: 'base' | 'panel'
}

export function Section({ id, children, className, tone = 'base' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-24 py-14 sm:py-20 lg:py-28',
        tone === 'panel' && 'bg-graphite',
        className,
      )}
    >
      {children}
    </section>
  )
}

type HeadingProps = {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  index?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  index,
  align = 'left',
  className,
}: HeadingProps) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
        {index && <span className="font-mono text-xs text-faint">{index}</span>}
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      </div>
      <h2 className="mt-4 text-3xl font-bold leading-[1.05] text-fg sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed text-muted sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}

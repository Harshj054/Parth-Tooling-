import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Section'

/** Inner-page hero. Clears the fixed navbar and sets a consistent, on-brand
 *  entry with the blueprint grid fading out beneath the title. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-28 sm:pb-20 sm:pt-40">
      <div className="blueprint-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-arc/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.03] text-fg sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.18}>
            <div className="mt-9">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

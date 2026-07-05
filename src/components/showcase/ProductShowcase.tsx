import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { showcaseParts, type ShowcasePart } from '@/data/parts'
import { Section } from '@/components/ui/Section'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { PartCard } from './PartCard'
import { ManufacturingViewer } from './ManufacturingViewer'

/**
 * The interactive "one machine, every part" grid. Clicking a card opens the
 * shared forming clip that dissolves into the real-time 3D part. Lives on the
 * dedicated /showcase page; the page's PageHeader carries the title.
 */
export function ProductShowcase() {
  const [active, setActive] = useState<ShowcasePart | null>(null)

  return (
    <Section id="showcase" className="pt-6 sm:pt-8 lg:pt-10">
      <div className="container-x">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseParts.map((p) => (
            <StaggerItem key={p.id} className="h-full">
              <PartCard part={p} onOpen={() => setActive(p)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {active && (
          <ManufacturingViewer key={active.id} part={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </Section>
  )
}

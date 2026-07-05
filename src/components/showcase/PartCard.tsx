import { ArrowUpRight, Box } from 'lucide-react'
import type { ShowcasePart } from '@/data/parts'
import { Crosshair } from '@/components/visuals/Crosshair'
import { cn } from '@/lib/utils'

// Warm the GLB into the HTTP cache on hover so the viewer opens instantly —
// a plain fetch, so three.js/drei stay out of the main bundle.
const warmed = new Set<string>()
function warm(src?: string) {
  if (!src || warmed.has(src)) return
  warmed.add(src)
  fetch(src).catch(() => {})
}

export function PartCard({ part, onOpen }: { part: ShowcasePart; onOpen: () => void }) {
  const live = Boolean(part.model)
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => warm(part.model)}
      onFocus={() => warm(part.model)}
      className="lift group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-6 text-left hover:border-arc/50 hover:shadow-glow-arc"
    >
      <Crosshair className="absolute -right-10 -top-10 h-40 w-40 opacity-40 transition-opacity group-hover:opacity-80" />
      {/* shine sweep on hover */}
      <span className="pointer-events-none absolute inset-y-0 -left-full w-full bg-arc-sheen transition-transform duration-700 ease-out group-hover:translate-x-[200%]" />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">{part.category}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.14em]',
            live ? 'border-arc/40 text-arc' : 'border-line text-faint',
          )}
        >
          <Box className="h-3 w-3" /> {live ? '3D' : 'Soon'}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-bold text-fg">{part.name}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">{part.blurb}</p>

      <div className="relative mt-6 flex items-center justify-between">
        <span className="font-mono text-[0.62rem] text-faint">{part.material}</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-arc">
          {live ? 'View 3D' : 'Preview'}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </button>
  )
}

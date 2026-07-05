import { Suspense } from 'react'
import { PartViewer } from '@/components/viewer/PartViewer'

/**
 * Prototype surface for the "manufacturing viewer" — proves the CAD → GLB →
 * real-time 3D pipeline end to end. Full-screen, no chrome. Later this becomes
 * the panel that opens when a product card is clicked.
 */
const SPECS = [
  ['Material', 'SS 304'],
  ['Process', 'Cast · 5-axis machined'],
  ['Tolerance', '±0.02 mm'],
  ['Ø', '192 mm'],
]

export default function Viewer() {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-gradient-to-b from-panel-2 to-ink">
      {/* faint engineering ground */}
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="absolute left-0 top-0 z-10 p-6 sm:p-10">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" />
          Manufacturing viewer · prototype
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tightest text-fg sm:text-5xl">
          Centrifugal Impeller
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted sm:text-base">
          Real-time 3D, tessellated from the client&rsquo;s STEP file. Drag to rotate · scroll to zoom.
        </p>
      </div>

      <div className="absolute inset-0">
        <Suspense fallback={<div className="grid h-full place-items-center font-mono text-xs text-faint">loading model…</div>}>
          <PartViewer src="/models/impeller.glb" />
        </Suspense>
      </div>

      {/* spec rail */}
      <div className="absolute bottom-0 left-0 z-10 w-full p-6 sm:p-10">
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {SPECS.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">{k}</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  )
}

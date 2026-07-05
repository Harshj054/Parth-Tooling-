import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PartViewer } from '@/components/viewer/PartViewer'
import { showcaseParts } from '@/data/parts'

/**
 * Isolated 3D viewer — just the model, no press, no marketing chrome. Opened
 * from the forge bay ("View 3D only") so the user can study a single part on a
 * clean turntable. Full-screen, drag-to-rotate, scroll-to-zoom.
 */
const SPEC_KEYS = ['material', 'process', 'tolerance', 'dim'] as const
const SPEC_LABELS: Record<(typeof SPEC_KEYS)[number], string> = {
  material: 'Material',
  process: 'Process',
  tolerance: 'Tolerance',
  dim: 'Size',
}

export default function PartView() {
  const { id } = useParams()
  const part = showcaseParts.find((p) => p.id === id)

  return (
    <main className="relative h-svh w-full overflow-hidden bg-gradient-to-b from-panel-2 to-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="absolute left-0 top-0 z-10 p-6 sm:p-10">
        <Link to="/showcase" className="eyebrow transition-colors hover:text-arc-bright">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to the forge
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tightest text-fg sm:text-5xl">
          {part?.name ?? '3D model'}
        </h1>
        {part?.model && (
          <p className="mt-2 max-w-md text-sm text-muted sm:text-base">
            Real-time 3D, tessellated from the client&rsquo;s STEP file. Drag to rotate · scroll to zoom.
          </p>
        )}
      </div>

      {part?.model ? (
        <>
          <div className="absolute inset-0">
            <Suspense
              fallback={
                <div className="grid h-full place-items-center font-mono text-xs text-faint">loading model…</div>
              }
            >
              <PartViewer src={part.model} />
            </Suspense>
          </div>

          <div className="absolute bottom-0 left-0 z-10 w-full p-6 sm:p-10">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {SPEC_KEYS.map((k) => (
                <div key={k}>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">{SPEC_LABELS[k]}</dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-fg">{part[k]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center px-6">
          <div className="max-w-sm rounded-2xl border border-line bg-panel/70 px-8 py-7 text-center backdrop-blur">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-arc">
              Interactive 3D · in production
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {part
                ? `The live model for the ${part.name.toLowerCase()} is being tessellated from CAD.`
                : 'That part could not be found.'}
            </p>
            <Link
              to="/showcase"
              className="mt-5 inline-block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-arc transition-colors hover:text-arc-bright"
            >
              ← Back to the forge
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

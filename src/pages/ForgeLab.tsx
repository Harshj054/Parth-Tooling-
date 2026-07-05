import { useState } from 'react'
import { ForgeScene } from '@/components/showcase/ForgeScene'

/** Temporary preview surface for the 3D forge sequence (Stage 1). */
export default function ForgeLab() {
  const [run, setRun] = useState(false)
  const [k, setK] = useState(0)

  return (
    <main className="relative h-svh w-full overflow-hidden bg-gradient-to-b from-panel-2 to-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <ForgeScene key={k} src="/models/impeller.glb" run={run} />

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          onClick={() => setRun(true)}
          className="rounded-full bg-arc px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink hover:bg-arc-bright"
        >
          Forge
        </button>
        <button
          onClick={() => {
            setRun(false)
            setK((v) => v + 1)
          }}
          className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:border-arc/50 hover:text-fg"
        >
          Reset
        </button>
      </div>
    </main>
  )
}

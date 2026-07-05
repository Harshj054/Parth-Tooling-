import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Hammer, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { showcaseParts, type ShowcasePart } from '@/data/parts'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { ForgeScene, type BlankShape } from './ForgeScene'

type Phase = 'idle' | 'forging' | 'formed'

/* Raw-stock chip the user drags into the press — an animated 3D-looking metal
   billet. Shape hints at the process (billet / disc / strip). It floats, a
   specular highlight sweeps across it, and a ring pulses to say "grab me". */
function StockChip({ shape, active }: { shape: BlankShape; active?: boolean }) {
  const dims = shape === 'strip' ? 'h-7 w-24' : shape === 'disc' ? 'h-11 w-20' : 'h-16 w-16'
  const round = shape === 'strip' ? 'rounded-[6px]' : shape === 'disc' ? 'rounded-[50%]' : 'rounded-full'
  return (
    <span className="animate-chip-float relative block" aria-hidden="true">
      {/* attention pulse */}
      <span className={cn('animate-chip-pulse pointer-events-none absolute inset-0 border-2 border-arc/50', round)} />
      {/* ground shadow (depth) */}
      <span className="pointer-events-none absolute -bottom-2.5 left-1/2 h-2.5 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
      {/* metal body: bright-top → dark-bottom shading = cylindrical 3D read */}
      <span
        className={cn(
          'relative block overflow-hidden bg-gradient-to-b from-[#f3f6fa] via-[#aeb8c4] to-[#525a65]',
          dims,
          round,
          active && 'ring-2 ring-arc ring-offset-2 ring-offset-ink',
        )}
        style={{
          boxShadow:
            'inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -9px 14px rgba(0,0,0,0.5), 0 14px 24px -8px rgba(0,0,0,0.7)',
        }}
      >
        {/* brushed metal grain */}
        <span
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 3px)' }}
        />
        {/* moving specular sweep — light travelling across polished steel */}
        <span className="animate-chip-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        {/* top rim highlight (the cylinder's lit edge) */}
        {shape !== 'strip' && (
          <span className="absolute inset-x-[16%] top-[7%] h-[22%] rounded-[50%] bg-white/55 blur-[1px]" />
        )}
      </span>
    </span>
  )
}

function DragBlank({
  bayRef,
  shape,
  onForge,
}: {
  bayRef: React.RefObject<HTMLDivElement>
  shape: BlankShape
  onForge: () => void
}) {
  const chipRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [near, setNear] = useState(false)
  const [dragging, setDragging] = useState(false)
  const offset = useRef({ x: 0, y: 0 })

  const zone = useCallback(() => {
    const b = bayRef.current!.getBoundingClientRect()
    return { cx: b.left + b.width * 0.5, cy: b.top + b.height * 0.46, r: Math.min(b.width, b.height) * 0.24, b }
  }, [bayRef])

  const move = useCallback(
    (e: PointerEvent) => {
      const b = bayRef.current!.getBoundingClientRect()
      setPos({ x: e.clientX - b.left - offset.current.x, y: e.clientY - b.top - offset.current.y })
      const z = zone()
      setNear(Math.hypot(e.clientX - z.cx, e.clientY - z.cy) < z.r)
    },
    [bayRef, zone],
  )

  const end = useCallback(
    (e: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      setDragging(false)
      const z = zone()
      if (Math.hypot(e.clientX - z.cx, e.clientY - z.cy) < z.r) onForge()
      else {
        setPos(null)
        setNear(false)
      }
    },
    [move, onForge, zone],
  )

  const start = (e: React.PointerEvent) => {
    const r = chipRef.current!.getBoundingClientRect()
    offset.current = { x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) }
    setDragging(true)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
  }

  useEffect(
    () => () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
    },
    [move, end],
  )

  return (
    <>
      {/* drop-zone highlight */}
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-[46%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed transition-all duration-200',
          near ? 'scale-110 border-arc opacity-100' : 'scale-100 border-arc/25 opacity-70',
        )}
      />

      {/* hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 p-6 text-center">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-faint">
          Drag the stock into the press
        </span>
      </div>

      {/* draggable raw stock */}
      <button
        ref={chipRef}
        type="button"
        onPointerDown={start}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onForge())}
        aria-label="Drag the raw stock into the press to forge the part — or press Enter"
        className={cn(
          'absolute z-20 grid touch-none place-items-center rounded-xl p-2 focus-visible:outline-none',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        style={
          pos
            ? { left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }
            : { left: '15%', top: '76%', transform: 'translate(-50%, -50%)' }
        }
      >
        <StockChip shape={shape} active={near} />
      </button>

      {/* fallback trigger */}
      <button
        type="button"
        onClick={onForge}
        className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-arc px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-arc-bright"
      >
        <Hammer className="h-3.5 w-3.5" /> Forge
      </button>
    </>
  )
}

const SPEC_KEYS = ['material', 'process', 'tolerance', 'dim'] as const
const SPEC_LABELS: Record<(typeof SPEC_KEYS)[number], string> = {
  material: 'Material',
  process: 'Process',
  tolerance: 'Tolerance',
  dim: 'Size',
}

export function ForgeBay() {
  const reduce = useReducedMotion() ?? false
  const [selected, setSelected] = useState<ShowcasePart>(showcaseParts[0])
  const [phase, setPhase] = useState<Phase>(reduce ? 'formed' : 'idle')
  const [run, setRun] = useState(false)
  const [nonce, setNonce] = useState(0)
  const [isFs, setIsFs] = useState(false)
  const bayRef = useRef<HTMLDivElement>(null)

  const toggleFs = useCallback(() => {
    const el = bayRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen?.()
    else void el.requestFullscreen?.()
  }, [])

  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const startForge = useCallback(() => {
    setPhase((p) => (p === 'idle' ? 'forging' : p))
    setRun(true)
  }, [])

  const load = useCallback(
    (part: ShowcasePart) => {
      setSelected(part)
      setRun(false)
      setNonce((n) => n + 1)
      setPhase(reduce ? 'formed' : 'idle')
    },
    [reduce],
  )

  useEffect(() => {
    if (selected.model) fetch(selected.model).catch(() => {})
  }, [selected.model])

  const formed = phase === 'formed'

  return (
    <section id="showcase" className="relative py-4 sm:py-8">
      <div className="container-x">
        {/* ── THE FORGE BAY ── */}
        <div
          ref={bayRef}
          data-forge-bay
          className="relative select-none overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-panel-2/70 to-ink"
          style={{ height: 'min(64svh, 600px)' }}
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

          <ForgeScene
            key={`${selected.id}-${nonce}`}
            src={selected.model}
            shape={selected.blank}
            run={run}
            onDone={() => setPhase('formed')}
          />

          {/* header */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
            <div>
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" />
                {selected.category}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tightest text-fg sm:text-3xl">
                {selected.name}
              </h3>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              {formed && (
                <button
                  type="button"
                  onClick={() => load(selected)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/50 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted backdrop-blur transition-colors hover:border-arc/50 hover:text-fg"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Forge again
                </button>
              )}
              <button
                type="button"
                onClick={toggleFs}
                aria-label={isFs ? 'Exit fullscreen' : 'View fullscreen'}
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel/50 text-muted backdrop-blur transition-colors hover:border-arc/50 hover:text-fg"
              >
                {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* drag interaction (idle only) */}
          {phase === 'idle' && !reduce && (
            <DragBlank bayRef={bayRef} shape={selected.blank} onForge={startForge} />
          )}

          {/* "in production" overlay for parts without a model */}
          {formed && !selected.model && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
              <div className="max-w-sm rounded-2xl border border-line bg-panel/70 px-8 py-7 text-center backdrop-blur">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-arc">
                  Interactive 3D · in production
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  The live model for the {selected.name.toLowerCase()} is being tessellated from CAD.
                  Request it and we&rsquo;ll send the 3D and the drawing.
                </p>
              </div>
            </div>
          )}

          {/* specs + CTA (formed) */}
          <AnimatePresence>
            {formed && (
              <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-7"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.25 }}
              >
                <p className="mb-3 max-w-md text-sm leading-relaxed text-muted">{selected.blurb}</p>
                <dl className="flex flex-wrap items-end gap-x-7 gap-y-3">
                  {SPEC_KEYS.map((k) => (
                    <div key={k}>
                      <dt className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-faint">
                        {SPEC_LABELS[k]}
                      </dt>
                      <dd className="mt-1 font-display text-sm font-semibold text-fg sm:text-base">
                        {selected[k]}
                      </dd>
                    </div>
                  ))}
                  <a
                    href="/contact"
                    className="pointer-events-auto ml-auto inline-flex items-center gap-1.5 rounded-full bg-arc px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-arc-bright"
                  >
                    Request CAD <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </dl>
                {selected.model && (
                  <p className="mt-3 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-faint">
                    Drag to rotate · scroll to zoom
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── PART SELECTOR ── */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {showcaseParts.map((p) => {
            const active = p.id === selected.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => load(p)}
                aria-pressed={active}
                className={cn(
                  'group relative overflow-hidden rounded-xl border p-4 text-left transition-colors',
                  active
                    ? 'border-arc/60 bg-panel shadow-glow-arc'
                    : 'border-line bg-panel/60 hover:border-arc/40 hover:bg-panel',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-faint">
                    {p.category}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[0.5rem] uppercase tracking-[0.14em]',
                      p.model ? 'text-arc' : 'text-faint',
                    )}
                  >
                    {p.model ? '3D' : 'Soon'}
                  </span>
                </div>
                <h4 className="mt-3 font-display text-sm font-bold leading-tight text-fg">{p.name}</h4>
                <span className="mt-1 block font-mono text-[0.58rem] text-faint">{p.material}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

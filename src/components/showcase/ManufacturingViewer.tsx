import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, RotateCcw, X } from 'lucide-react'
import type { ShowcasePart } from '@/data/parts'
import { getLenis } from '@/lib/lenis'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

const PartViewer = lazy(() =>
  import('@/components/viewer/PartViewer').then((m) => ({ default: m.PartViewer })),
)

const VIDEO = '/press.mp4'
const POSTER = '/press-poster.jpg'

/**
 * The "one machine, every part" viewer. Plays the shared forming clip, and as
 * its mist peaks near the end, cross-fades to the real-time 3D part that has
 * been loading underneath the whole time — so the component appears to
 * materialise out of the smoke, and dragging it (real geometry) never breaks
 * the illusion. Reduced motion skips the film. Parts without a model yet show
 * an honest "in production" reveal, and light up the moment a GLB is added.
 */
export function ManufacturingViewer({ part, onClose }: { part: ShowcasePart; onClose: () => void }) {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'press' | 'reveal'>(reduce ? 'reveal' : 'press')
  const revealed = phase === 'reveal'

  // Scroll-lock (Lenis + body) and ESC-to-close while open.
  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Start the forming clip a touch faster so the reveal doesn't feel slow.
  useEffect(() => {
    if (reduce) return
    const v = videoRef.current
    if (!v) return
    v.playbackRate = 1.35
    v.currentTime = 0
    v.play().catch(() => {})
  }, [reduce])

  const onTime = () => {
    const v = videoRef.current
    if (v?.duration && v.currentTime >= v.duration - 2.2) setPhase('reveal')
  }

  const replay = () => {
    const v = videoRef.current
    setPhase('press')
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {/* Real-time 3D, mounted immediately so it loads under the film. */}
      {part.model && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            revealed ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Suspense fallback={null}>
            <PartViewer src={part.model} />
          </Suspense>
        </div>
      )}

      {/* Forming clip on top; fades out at the mist peak once a real model is
          ready. Without a model we hold — and dim — the final mist frame. */}
      {!reduce && (
        <video
          ref={videoRef}
          className={cn(
            'grade-video pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms]',
            revealed && part.model ? 'opacity-0' : revealed ? 'opacity-45' : 'opacity-100',
          )}
          src={VIDEO}
          poster={POSTER}
          muted
          playsInline
          autoPlay
          onTimeUpdate={onTime}
          onEnded={() => setPhase('reveal')}
        />
      )}

      {/* Mist bridge — a soft haze that lingers over the seam then clears. */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-[1600ms]',
          revealed ? 'opacity-0' : 'opacity-70',
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
      </div>

      {/* No model yet → honest "in production" reveal, above the held frame. */}
      {!part.model && revealed && <ComingSoon part={part} />}

      {/* Header — non-blocking so you can also grab the model up here. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5 sm:p-8">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" />
            {part.category}
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tightest text-fg sm:text-4xl">
            {part.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close viewer"
          className="pointer-events-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-panel/50 text-muted backdrop-blur transition-colors hover:border-arc/50 hover:text-fg"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Specs + controls, revealed with the part. The bar itself is
          click-through (so drags over it still rotate the model); only the
          buttons re-enable pointer events. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: revealed ? 0.35 : 0 }}
      >
        <p className="mb-4 max-w-md text-sm leading-relaxed text-muted">{part.blurb}</p>
        <dl className="flex flex-wrap items-end gap-x-8 gap-y-3">
          {[
            ['Material', part.material],
            ['Process', part.process],
            ['Tolerance', part.tolerance],
            ['Size', part.dim],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-faint">{k}</dt>
              <dd className="mt-1 font-display text-base font-semibold text-fg">{v}</dd>
            </div>
          ))}
          <div className="pointer-events-auto ml-auto flex items-center gap-2">
            {part.model && !reduce && (
              <button
                onClick={replay}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted transition-colors hover:border-arc/50 hover:text-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Replay
              </button>
            )}
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-arc px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-arc-bright"
            >
              Request CAD <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </dl>
        {part.model && (
          <p
            className={cn(
              'mt-4 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-faint transition-opacity duration-700',
              revealed ? 'opacity-100' : 'opacity-0',
            )}
          >
            Drag to rotate · scroll to zoom
          </p>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  )
}

function ComingSoon({ part }: { part: ShowcasePart }) {
  return (
    <div className="absolute inset-0 grid place-items-center px-6">
      <div className="max-w-sm rounded-2xl border border-line bg-panel/70 px-8 py-7 text-center backdrop-blur">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-arc">
          Interactive 3D · in production
        </span>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The live model for the {part.name.toLowerCase()} is being tessellated from CAD. Request it
          and we&rsquo;ll send the 3D and the drawing.
        </p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { setVideoObjectUrl } from '@/lib/mediaCache'
import { LogoMark } from '@/components/brand/Logo'

const MIN_MS = 700
const MAX_MS = 9000

/**
 * Branded loading screen. Downloads the hero video (the heavy asset) with a
 * real progress readout and caches it in memory so the scroll-scrub is smooth
 * from the first frame; also gates on the hero image and web fonts. Fades out
 * once ready, with a hard timeout so it can never hang.
 */
export function Preloader() {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let alive = true
    const start = performance.now()
    const bump = (v: number) => alive && setProgress((p) => (v > p ? v : p))

    const imgP = new Promise<void>((res) => {
      const img = new Image()
      img.onload = () => res()
      img.onerror = () => res()
      img.src = '/hero.png'
    })

    const fontP = (document.fonts?.ready ?? Promise.resolve(undefined)).then(() => undefined)

    const videoP = (async () => {
      try {
        const resp = await fetch('/hero-scroll.mp4')
        const total = Number(resp.headers.get('content-length')) || 0
        if (!resp.body || !total) {
          const blob = await resp.blob()
          setVideoObjectUrl(URL.createObjectURL(blob))
          bump(96)
          return
        }
        const reader = resp.body.getReader()
        const chunks: BlobPart[] = []
        let received = 0
        for (;;) {
          const { done: streamDone, value } = await reader.read()
          if (streamDone) break
          if (value) {
            chunks.push(value as BlobPart)
            received += value.length
            bump(Math.min(96, Math.round((received / total) * 96)))
          }
        }
        setVideoObjectUrl(URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' })))
      } catch {
        /* offline / blocked — site still works from the network src */
        bump(96)
      }
    })()

    Promise.all([imgP, fontP, videoP]).then(async () => {
      const elapsed = performance.now() - start
      if (elapsed < MIN_MS) await new Promise((r) => setTimeout(r, MIN_MS - elapsed))
      if (!alive) return
      setProgress(100)
      setTimeout(() => alive && setDone(true), reduce ? 0 : 450)
    })

    const cap = setTimeout(() => {
      if (alive) {
        setProgress(100)
        setDone(true)
      }
    }, MAX_MS)

    return () => {
      alive = false
      clearTimeout(cap)
    }
  }, [reduce])

  // Lock the page while the loader is up.
  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${progress}%`}
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/10 blur-[90px]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_6s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#1E2C3B" strokeWidth="1" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="#3DA0FF" strokeWidth="1.5" strokeDasharray="20 270" strokeLinecap="round" />
              </svg>
              <LogoMark className="h-12 w-12 text-fg" />
            </div>

            <p className="mt-8 font-display text-lg font-bold tracking-tightest text-fg">
              PARTH<span className="text-arc"> TOOLING</span>
            </p>

            <div className="mt-6 h-px w-56 overflow-hidden bg-line">
              <div
                className="h-full bg-arc transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(61,160,255,0.7)' }}
              />
            </div>

            <div className="mt-3 flex w-56 items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.22em] text-faint">
              <span>Calibrating</span>
              <span className="tabular-nums text-arc">{String(progress).padStart(3, '0')}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

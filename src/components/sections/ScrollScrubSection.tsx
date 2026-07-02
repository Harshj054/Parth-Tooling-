import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Eyebrow } from '@/components/ui/Section'
import { Haze } from '@/components/visuals/Haze'
import { getVideoObjectUrl, onVideoReady } from '@/lib/mediaCache'

const VIDEO = '/hero-scroll.mp4'
const POSTER = '/hero.png'

const CAPTIONS = [
  {
    title: 'Cut to the micron',
    text: 'Hardened tool steel, machined on our VMCs to the tolerance your part demands.',
  },
  {
    title: 'Proven at the contact point',
    text: 'Every die is tried, measured and recorded before it ever reaches your press.',
  },
  {
    title: 'Built to run, and run',
    text: 'Tooling engineered to hold spec across long, high-volume production.',
  },
]

export function ScrollScrubSection() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetRef = useRef(0) // scroll progress 0..1
  const easedRef = useRef(0) // smoothed progress driving the video
  const [pct, setPct] = useState(0)

  // Play from the in-memory copy the preloader cached (instant seeking).
  const [src, setSrc] = useState<string>(() => getVideoObjectUrl() || VIDEO)
  useEffect(() => onVideoReady(setSrc), [])

  const active = useInView(sectionRef, { margin: '10% 0px 10% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const op0 = useTransform(scrollYProgress, [0.02, 0.1, 0.28, 0.36], [0, 1, 1, 0])
  const op1 = useTransform(scrollYProgress, [0.38, 0.46, 0.62, 0.7], [0, 1, 1, 0])
  const op2 = useTransform(scrollYProgress, [0.72, 0.8, 0.96, 1], [0, 1, 1, 1])
  const y0 = useTransform(scrollYProgress, [0.02, 0.1], [24, 0])
  const y1 = useTransform(scrollYProgress, [0.38, 0.46], [24, 0])
  const y2 = useTransform(scrollYProgress, [0.72, 0.8], [24, 0])
  const caps = [
    { ...CAPTIONS[0], opacity: op0, y: y0 },
    { ...CAPTIONS[1], opacity: op1, y: y1 },
    { ...CAPTIONS[2], opacity: op2, y: y2 },
  ]

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    targetRef.current = p
    const next = Math.round(p * 100)
    setPct((prev) => (prev !== next ? next : prev))
  })

  // Eased seek loop — lerp the video toward the scroll target so scrubbing is
  // fluid rather than stepping frame-to-frame. Only works while on-screen.
  useEffect(() => {
    if (reduce) return
    let raf = 0
    const tick = () => {
      const v = videoRef.current
      const d = v?.duration
      if (active && v && d && Number.isFinite(d)) {
        easedRef.current += (targetRef.current - easedRef.current) * 0.16
        const t = easedRef.current * d
        if (Math.abs(v.currentTime - t) > 0.04) {
          try {
            v.currentTime = t
          } catch {
            /* not seekable yet */
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, active])

  const onLoaded = () => {
    const v = videoRef.current
    v?.play().then(() => v.pause()).catch(() => {})
  }

  if (reduce) {
    return (
      <section className="relative">
        <video
          src={src}
          poster={POSTER}
          muted
          playsInline
          controls
          preload="metadata"
          className="grade-video h-[60svh] w-full object-cover"
          aria-label="Precision machining at Parth Tooling"
        />
        <div className="container-x py-10">
          <Eyebrow>The process</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold text-fg sm:text-3xl">
            From hardened block to proven die.
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-[220vh] sm:h-[260vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden bg-ink">
        <video
          ref={videoRef}
          src={src}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={onLoaded}
          className="grade-video absolute inset-0 h-full w-full object-cover"
          aria-label="Precision machining at Parth Tooling"
        />

        {/* Atmosphere + grade */}
        <Haze />
        {/* Emerge from — and dissolve back into — pure black so the hero above
            and the sections below melt into one continuous cinematic column.
            No hard seam: the footage reveals itself as it scrolls up. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-ink via-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        {/* Left scrim keeps the captions legible while the centre-right footage
            stays bright enough to actually read the cut. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/45 to-transparent" />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />

        {/* Captions (crossfade with scroll) */}
        <div className="container-x relative">
          <div className="relative h-44 max-w-xl sm:h-40">
            {caps.map((c, i) => (
              <motion.div
                key={i}
                style={{ opacity: c.opacity, y: c.y }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <Eyebrow>{`0${i + 1} / 03`}</Eyebrow>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-fg sm:text-4xl lg:text-5xl">
                  {c.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress readout */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
          <span className="font-mono text-xs tabular-nums text-arc">
            {String(pct).padStart(3, '0')}%
          </span>
          <span className="relative h-40 w-px overflow-hidden bg-line">
            <motion.span
              style={{ scaleY: scrollYProgress }}
              className="absolute inset-0 block origin-top bg-arc"
            />
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">Sec A–A</span>
        </div>
      </div>
    </section>
  )
}

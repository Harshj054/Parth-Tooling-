import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const POSTER = '/hero.png'
const VIDEO = '/hero-bg.mp4'
const ALT = 'A CNC vertical machining centre cutting a hardened steel die block, sparks flying'
const LAYER = 'absolute inset-0 h-full w-full object-cover object-right'

/**
 * Hero background media. Autoplaying muted loop video over an instantly-painted
 * poster image (LCP), fading in once it can play. Pauses when scrolled off-screen
 * to save battery/CPU. Under reduced motion it degrades to the static poster —
 * no autoplay — per the skill's Auto-Play Video + reduced-motion guidance.
 */
export function HeroMedia() {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduce) return
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])

  if (reduce) {
    return <img src={POSTER} alt={ALT} className={LAYER} />
  }

  return (
    <>
      {/* Instant poster underlay */}
      <img src={POSTER} alt="" aria-hidden="true" className={LAYER} />
      <video
        ref={videoRef}
        className={cn(LAYER, 'grade-video transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')}
        poster={POSTER}
        src={VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
        aria-hidden="true"
      />
    </>
  )
}

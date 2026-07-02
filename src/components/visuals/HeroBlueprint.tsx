import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { useMediaQuery } from '@/lib/useMediaQuery'

const ARC = '#3DA0FF'
const EMBER = '#FF6B2C'
const STEEL = '#2C3E52'
const MUTED = '#8A99AD'
const MONO = "'JetBrains Mono', monospace"

/**
 * The hero's thesis, in the subject's own language: a die-set cross-section
 * drawn as an engineering blueprint. Line work draws in, dimension callouts
 * fade up, and the punch strokes onto the strip with an ember contact glow.
 *
 * Responsive: on phones the viewBox crops to the mechanism (≈2× larger) and the
 * fine dimension annotations drop away — they'd be unreadable at that scale.
 */
export function HeroBlueprint({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const detailed = useMediaQuery('(min-width: 640px)')

  const drawIn = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.1, ease: EASE_OUT, delay },
  })
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  })

  const strokeLoop = reduce
    ? {}
    : {
        animate: { y: [0, 10, 0] },
        transition: { duration: 2.6, ease: 'easeInOut' as const, repeat: Infinity, repeatDelay: 0.4 },
      }

  const glowLoop = reduce
    ? { opacity: 0.5 }
    : { animate: { opacity: [0.15, 0.6, 0.15], scale: [0.9, 1.05, 0.9] }, transition: { duration: 2.6, repeat: Infinity, repeatDelay: 0.4 } }

  return (
    <svg
      viewBox={detailed ? '0 0 520 480' : '64 66 392 250'}
      className={className}
      role="img"
      aria-label="Engineering blueprint of a precision die set with dimension callouts"
    >
      <defs>
        <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={EMBER} stopOpacity="0.9" />
          <stop offset="60%" stopColor={EMBER} stopOpacity="0.15" />
          <stop offset="100%" stopColor={EMBER} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plateFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12202f" />
          <stop offset="100%" stopColor="#0a141d" />
        </linearGradient>
      </defs>

      {/* Blueprint frame + corner ticks (detailed view only) */}
      {detailed && (
        <>
          <motion.rect
            x="14" y="14" width="492" height="452" rx="3" fill="none" stroke={STEEL} strokeOpacity="0.5"
            {...fadeUp(0)}
          />
          <motion.g stroke={ARC} strokeWidth="1.5" strokeOpacity="0.7" {...fadeUp(0.1)}>
            <path d="M14 40V14h26" fill="none" />
            <path d="M480 14h26v26" fill="none" />
            <path d="M506 440v26h-26" fill="none" />
            <path d="M40 466H14v-26" fill="none" />
          </motion.g>
        </>
      )}

      {/* Vertical centre line (dash-dot) */}
      <motion.path
        d="M260 34V346" stroke={ARC} strokeOpacity="0.35" strokeWidth="1" fill="none"
        strokeDasharray="12 5 2 5" {...drawIn(0.5)}
      />

      {/* Guide pillars */}
      <motion.g stroke={STEEL} strokeWidth="2" {...fadeUp(0.3)}>
        <path d="M140 96V286" />
        <path d="M380 96V286" />
        <rect x="134" y="120" width="12" height="16" fill="url(#plateFill)" />
        <rect x="374" y="120" width="12" height="16" fill="url(#plateFill)" />
      </motion.g>

      {/* Upper shoe */}
      <motion.rect
        x="110" y="96" width="300" height="30" rx="3" fill="url(#plateFill)" stroke={ARC} strokeWidth="1.5"
        {...fadeUp(0.35)}
      />

      {/* Ember contact glow */}
      <motion.circle cx="260" cy="220" r="58" fill="url(#emberGlow)" {...glowLoop} />

      {/* Punch (strokes down onto the strip) */}
      <motion.g {...strokeLoop}>
        <rect x="246" y="126" width="28" height="66" rx="1.5" fill="url(#plateFill)" stroke={ARC} strokeWidth="1.5" />
        <path d="M248 192h24l-4 8h-16Z" fill={EMBER} fillOpacity="0.9" />
        {!reduce && (
          <>
            <motion.circle cx="252" cy="206" r="1.6" fill={EMBER}
              animate={{ cy: [206, 222], opacity: [1, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 1.3, delay: 1 }} />
            <motion.circle cx="268" cy="206" r="1.3" fill={EMBER}
              animate={{ cy: [206, 226], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.1, delay: 1.2 }} />
          </>
        )}
      </motion.g>

      {/* Sheet-metal strip with pierced holes (active one glows ember) */}
      <motion.g {...fadeUp(0.5)}>
        <rect x="70" y="214" width="380" height="12" fill="#0e1a26" stroke={STEEL} strokeWidth="1.2" />
        {[160, 210, 340, 390].map((cx) => (
          <circle key={cx} cx={cx} cy="220" r="4.5" fill="none" stroke={MUTED} strokeWidth="1.2" />
        ))}
        <circle cx="260" cy="220" r="5" fill="none" stroke={EMBER} strokeWidth="1.6" />
      </motion.g>

      {/* Die plate + lower shoe */}
      <motion.rect
        x="110" y="226" width="300" height="34" rx="3" fill="url(#plateFill)" stroke={ARC} strokeWidth="1.5"
        {...fadeUp(0.45)}
      />
      <motion.rect
        x="96" y="260" width="328" height="26" rx="3" fill="url(#plateFill)" stroke={STEEL} strokeWidth="1.5"
        {...fadeUp(0.4)}
      />

      {/* Compact diameter callout — shown in both views (kept clear of edges) */}
      <motion.g {...fadeUp(0.7)} fontFamily={MONO}>
        <path d="M264 220 300 186" fill="none" stroke={EMBER} strokeOpacity="0.85" strokeWidth="1" />
        <circle cx="264" cy="220" r="2" fill={EMBER} />
        <text x="286" y="176" fill={EMBER} fontSize="12">Ø10 ±0.01</text>
      </motion.g>

      {/* Detailed-only annotations */}
      {detailed && (
        <>
          {/* Bottom horizontal dimension */}
          <motion.g {...fadeUp(0.9)} fontFamily={MONO}>
            <path d="M110 290V320M410 290V320" stroke={STEEL} strokeWidth="1" />
            <path d="M110 316H410" stroke={MUTED} strokeWidth="1" />
            <path d="M110 316l7-3v6ZM410 316l-7-3v6Z" fill={MUTED} />
            <rect x="232" y="308" width="56" height="16" fill="#070A0F" />
            <text x="260" y="320" textAnchor="middle" fill={MUTED} fontSize="12">300.00</text>
          </motion.g>

          {/* Left vertical dimension */}
          <motion.g {...fadeUp(1)} fontFamily={MONO}>
            <path d="M92 96H64M92 286H64" stroke={STEEL} strokeWidth="1" />
            <path d="M70 96V286" stroke={MUTED} strokeWidth="1" />
            <path d="M70 96l-3 7h6ZM70 286l-3-7h6Z" fill={MUTED} />
            <rect x="58" y="180" width="16" height="30" fill="#070A0F" />
            <text x="70" y="196" textAnchor="middle" fill={MUTED} fontSize="12" transform="rotate(-90 70 196)">190</text>
          </motion.g>

          {/* Title block */}
          <motion.g {...fadeUp(1.15)} fontFamily={MONO}>
            <rect x="300" y="424" width="188" height="34" fill="#0a141d" stroke={STEEL} strokeWidth="1" />
            <path d="M300 441h188M392 424v34" stroke={STEEL} strokeWidth="1" strokeOpacity="0.6" />
            <text x="308" y="437" fill={MUTED} fontSize="9">PARTH TOOLING</text>
            <text x="308" y="453" fill={ARC} fontSize="9">PT-2010</text>
            <text x="404" y="437" fill={MUTED} fontSize="8">SHT 1/1</text>
            <text x="404" y="453" fill={MUTED} fontSize="8">SCALE 1:2</text>
          </motion.g>
        </>
      )}
    </svg>
  )
}

import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Section'
import { Haze } from '@/components/visuals/Haze'

/**
 * The bridge between the hero and the scroll-scrub film. A quiet, solid-dark
 * editorial beat — a breather from the footage on either side — that names the
 * three stages every die passes through, then hands the eye down into the film
 * where it plays out. Uses the site's dimension-line / mono-index / arc language
 * so it reads as a natural step in the flow, not a bolt-on.
 */

const STAGES = [
  { no: '01', name: 'Cut', detail: 'A hardened block, machined on our VMCs to the micron your part demands.' },
  { no: '02', name: 'Try', detail: 'Tried and measured at the contact point — every dimension recorded, not assumed.' },
  { no: '03', name: 'Prove', detail: 'Run and re-run until it holds spec, shift after shift, across the whole order.' },
]

export function ProcessInterlude() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-28 lg:py-32">
      {/* Faint atmosphere ties this panel to the footage above and below. */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <Haze className="opacity-40" grain={false} />
      {/* Melt in and out of the surrounding black so the whole run reads as one column. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-x relative">
        {/* Top rail — the dimension-line motif, echoing the divider and the film's Sec A–A readout. */}
        <div className="flex items-center gap-4">
          <Eyebrow>The process</Eyebrow>
          <motion.span
            className="hairline origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            style={{ flex: 1 }}
          />
          <span className="shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-faint">
            Sec A–A
          </span>
        </div>

        {/* Editorial statement — sets up the film. */}
        <Reveal className="mt-10 max-w-3xl" delay={0.05}>
          <h2 className="text-[1.8rem] font-bold leading-[1.12] tracking-tightest text-fg sm:text-4xl lg:text-[3rem] lg:leading-[1.08]">
            Every die is <span className="text-arc-gradient">cut, tried and proven</span> before it
            ever touches your press.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Three stages, one tool room — and a record for every dimension. Watch a hardened block
            become a die that holds tolerance, run after run.
          </p>
        </Reveal>

        {/* Three-stage index — the chapters the film below plays through. */}
        <Stagger
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
          stagger={0.09}
        >
          {STAGES.map((s) => (
            <StaggerItem key={s.no} className="h-full">
              <div className="group relative flex h-full flex-col bg-panel/70 p-6 backdrop-blur-sm transition-colors hover:bg-panel">
                {/* hairline that fills with arc on hover — the "measuring" gesture */}
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-arc/0 via-arc/60 to-arc/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" />
                  <span className="font-mono text-xs text-faint">{s.no} / 03</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-fg">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Handoff — mirrors the hero's scroll cue and points into the film. */}
        <Reveal className="mt-12 flex justify-center" delay={0.1}>
          <span className="flex flex-col items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-faint">
            Watch it made
            <span className="relative h-9 w-px overflow-hidden bg-line">
              <span className="animate-sweep-y absolute inset-x-0 top-0 h-3 bg-arc" />
            </span>
          </span>
        </Reveal>
      </div>
    </section>
  )
}

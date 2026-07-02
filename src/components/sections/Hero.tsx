import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { company } from '@/data/site'
import { fadeUp, staggerParent } from '@/lib/motion'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Haze } from '@/components/visuals/Haze'
import { HeroMedia } from '@/components/visuals/HeroMedia'

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
      {/* Cinematic background: our tool room, mid-cut (looping video over poster) */}
      <div className="absolute inset-0">
        <HeroMedia />
        {/* Legibility scrims — dark on the left where the copy sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <Haze className="opacity-60" />
      </div>

      <div className="container-x relative pb-20 pt-28 sm:pt-32">
        <motion.div
          variants={staggerParent(0.1, 0.05)}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp}>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" />
              Precision tool room · Est. {company.established}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-[2.4rem] font-bold leading-[1.04] tracking-tightest text-fg sm:text-6xl sm:leading-[1.02] lg:text-[4.4rem]"
          >
            Tooling engineered to <span className="text-arc-gradient">micron precision.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
            Parth Tooling designs and builds press tools, dies, jigs and fixtures that hold tolerance
            across long production runs — for the Tier-1 OEMs that can’t afford a part out of spec.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button to="/contact" size="lg" className="w-full sm:w-auto">
              Get a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
            <Button to="/products" variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore capabilities
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-2.5">
            <Chip tone="arc">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> {company.iso}
            </Chip>
            <Chip>MIDC Waluj · {company.address.city}</Chip>
            <Chip>Tier-1 OEM supplier</Chip>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
        <span className="flex flex-col items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-faint">
          Scroll
          <span className="relative h-9 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-3 bg-arc animate-sweep-y" />
          </span>
        </span>
      </div>
    </section>
  )
}

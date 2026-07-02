import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useSEO } from '@/lib/seo'
import { clients, industries, machineGroups, productCategories, qcdms, services, stats } from '@/data/site'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { StatCounter } from '@/components/ui/StatCounter'
import { DimensionDivider } from '@/components/ui/DimensionDivider'
import { Marquee } from '@/components/ui/Marquee'
import { Chip } from '@/components/ui/Chip'
import { ClientMark } from '@/components/ui/ClientMark'
import { Glyph, type GlyphName } from '@/components/visuals/Glyph'
import { Crosshair } from '@/components/visuals/Crosshair'
import { Hero } from '@/components/sections/Hero'
import { ScrollScrubSection } from '@/components/sections/ScrollScrubSection'
import { CTABand } from '@/components/sections/CTABand'

export default function Home() {
  useSEO(
    'Precision Press Tools, Dies, Jigs & Fixtures',
    'Parth Tooling Pvt Ltd designs and builds precision press tools, dies, jigs and fixtures. ISO 9001:2015 certified tool room in MIDC Waluj, Aurangabad, serving Tier-1 OEMs since 2010.',
  )

  return (
    <>
      <Hero />

      <ScrollScrubSection />

      <DimensionDivider label="Parth Tooling · Precision tool room · Aurangabad" />

      {/* Stats */}
      <Section className="py-16 sm:py-20">
        <div className="container-x">
          <Stagger className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StaggerItem key={s.label}>
                <div className="border-l border-line pl-5">
                  <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <div className="mt-2 font-display text-4xl font-bold text-fg sm:text-5xl">
                    <StatCounter
                      value={s.value}
                      prefix={s.kind === 'year' ? 'Est. ' : ''}
                      suffix={s.suffix}
                      group={s.kind !== 'year'}
                    />
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muted">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Capabilities */}
      <Section id="capabilities" tone="panel">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we do"
            title="Six capabilities, one tool room."
            intro="From the die that stamps the part to the fixture that inspects it — we own the whole chain, so quality and delivery stay in our hands."
          />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <article className="lift group h-full rounded-2xl border border-line bg-panel p-6 hover:border-arc/50 hover:shadow-glow-arc">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-ink text-arc transition-colors group-hover:border-arc/50">
                    <Glyph name={s.icon as GlyphName} className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-fg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Products preview */}
      <Section id="products">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Products"
              title="Built to hold tolerance, run after run."
              intro="Three product families, each precision-ground and proven on the shop floor."
            />
            <Reveal>
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 text-sm font-medium text-arc hover:text-arc-bright"
              >
                All products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
            {productCategories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  to={`/products#${cat.id}`}
                  className="lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-7 hover:border-arc/50 hover:shadow-glow-arc"
                >
                  <Crosshair className="absolute -right-10 -top-10 h-40 w-40 opacity-50 transition-opacity group-hover:opacity-90" />
                  <span className="relative font-mono text-sm text-faint">{cat.index}</span>
                  <h3 className="relative mt-6 text-2xl font-bold text-fg">{cat.title}</h3>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted">{cat.summary}</p>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-arc">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* QCDMS principles */}
      <Section tone="panel">
        <div className="container-x">
          <SectionHeading
            eyebrow="How we operate"
            title="Engineered on five principles."
            intro="QCDMS is how a small tool room earns a place on a Tier-1 supplier list — and keeps it."
          />
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {qcdms.map((p) => (
              <StaggerItem key={p.key} className="h-full">
                <div className="group flex h-full flex-col bg-panel p-6 transition-colors hover:bg-panel-2">
                  <span className="font-display text-5xl font-bold text-arc/25 transition-colors group-hover:text-arc/60">
                    {p.letter}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-fg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Infrastructure preview */}
      <Section>
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Infrastructure"
                title="A tool room built for precision."
                intro="Twelve CNC and precision machines across five disciplines — backed by a dedicated metrology lab, so every dimension is measured, not assumed."
              />
              <Reveal delay={0.1}>
                <Link
                  to="/infrastructure"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-arc hover:text-arc-bright"
                >
                  Tour the shop floor
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {machineGroups.map((g) => (
                <StaggerItem key={g.id}>
                  <div className="lift flex items-start gap-4 rounded-xl border border-line bg-panel p-5 hover:border-arc/50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-ink text-arc">
                      <Glyph name={g.kind} className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-fg">{g.title}</h3>
                      <p className="mt-1 font-mono text-[0.7rem] text-faint">
                        {g.machines.length} unit{g.machines.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      {/* Clients preview */}
      <Section tone="panel">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Clients"
            title="Trusted by Tier-1 OEMs."
            intro="When the part cannot be out of spec, these manufacturers put the tooling in our hands."
          />
        </div>
        <Reveal className="mt-14">
          <Marquee>
            {clients.map((c) => (
              <ClientMark key={c.name} name={c.name} tier={c.tier} />
            ))}
          </Marquee>
        </Reveal>
        <div className="container-x mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {industries.map((ind) => (
            <Chip key={ind}>{ind}</Chip>
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  )
}

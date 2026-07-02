import { Quote } from 'lucide-react'
import { useSEO } from '@/lib/seo'
import { company, qcdms, services } from '@/data/site'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { DimensionDivider } from '@/components/ui/DimensionDivider'
import { Glyph, type GlyphName } from '@/components/visuals/Glyph'
import { Crosshair } from '@/components/visuals/Crosshair'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/sections/CTABand'

const facts: { label: string; value: string }[] = [
  { label: 'Established', value: String(company.established) },
  { label: 'Business type', value: 'Manufacturing · Pvt Ltd' },
  { label: 'Team', value: `${company.employees} specialists` },
  { label: 'Headquarters', value: `${company.address.city}, Maharashtra` },
  { label: 'Quality system', value: company.iso },
  { label: 'Directors', value: company.directors.join(', ') },
  { label: 'Associate', value: company.associate },
  { label: 'GSTIN', value: company.gstin },
  { label: 'CIN', value: company.cin },
]

const philosophy = [
  {
    title: 'Respect for individuals',
    body: 'We believe contented people build prosperous enterprises. We honour human dignity, refuse discrimination, and grow the business by growing our workforce.',
  },
  {
    title: 'Mutually beneficial relationships',
    body: 'With customers and colleagues alike — respect for time, genuine care, and the guidance and resources people need to do their best work.',
  },
  {
    title: 'Responsibility to society',
    body: 'To enrich society while protecting the environment, support sustainable development, and operate as a dependable, transparent, fair business.',
  },
]

export default function About() {
  useSEO(
    'About',
    'Parth Tooling Pvt Ltd — a tool and die manufacturer founded in 2010 in Aurangabad, operating on QCDMS principles under an ISO 9001:2015 quality system.',
  )

  return (
    <>
      <PageHeader
        eyebrow="About Parth Tooling"
        title={
          <>
            Precision you can trust — <span className="text-arc-gradient">and people you can too.</span>
          </>
        }
        intro="Founded in 2010, Parth Tooling designs and builds press tools, dies, jigs and fixtures from a modern tool room in MIDC Waluj, Aurangabad — under an ISO 9001:2015 quality system."
      />

      {/* Overview */}
      <Section id="overview" className="pt-4">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rotate-45 bg-arc" aria-hidden="true" /> Overview
            </span>
            <h2 className="mt-4 text-3xl font-bold text-fg sm:text-4xl">Who we are, at a glance</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Parth Tooling Pvt Ltd was established in 2010 as a tool and die manufacturing company.
                Today we design and build press tools, dies, jigs and fixtures — with a modern facility
                and machinery that keeps production consistent and efficient.
              </p>
              <p>
                We hold ISO 9001:2015 certification and run rigorous quality management across every
                operation. Our foundation is simple: contribute to society by creating value together,
                with a vision for the future.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="steel-panel relative overflow-hidden rounded-2xl border border-line p-7">
              <Crosshair className="absolute -right-12 -top-12 h-44 w-44 opacity-40" />
              <h3 className="relative font-mono text-xs uppercase tracking-[0.24em] text-faint">
                Company file
              </h3>
              <dl className="relative mt-5 divide-y divide-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="shrink-0 text-sm text-muted">{f.label}</dt>
                    <dd className="text-right text-sm font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      <DimensionDivider label="QCDMS · Quality · Cost · Delivery · Management · Safety" />

      {/* Introduction / QCDMS */}
      <Section id="introduction" tone="panel">
        <div className="container-x">
          <SectionHeading
            eyebrow="Introduction"
            title="Five commitments, on every job."
            intro="QCDMS is the operating discipline behind our work — the reason customers keep coming back with the next program."
          />
          <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {qcdms.map((p) => (
              <StaggerItem key={p.key}>
                <div className="lift h-full rounded-2xl border border-line bg-panel p-6 hover:border-arc/50">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-arc/30 bg-arc/10 font-display text-lg font-bold text-arc">
                      {p.letter}
                    </span>
                    <h3 className="text-lg font-semibold text-fg">{p.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Philosophy */}
      <Section id="philosophy">
        <div className="container-x">
          <Reveal>
            <div className="steel-panel relative overflow-hidden rounded-3xl border border-line px-6 py-14 sm:px-14">
              <Quote className="h-9 w-9 text-arc/50" aria-hidden="true" />
              <blockquote className="mt-6 max-w-3xl font-display text-2xl font-medium leading-snug text-fg sm:text-3xl">
                “Contributing to a better world by creating value together, with a vision for the
                future.”
              </blockquote>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                — Company philosophy, Parth Tooling
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-8 grid gap-4 md:grid-cols-3">
            {philosophy.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-line bg-panel p-6">
                  <h3 className="text-base font-semibold text-fg">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" tone="panel">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our services"
            title="What we deliver, end to end."
            intro="We take responsibility for what we put on the market — with a product-quality guarantee and a commitment to deliver within the agreed timeframe."
          />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <article className="lift group flex h-full gap-4 rounded-2xl border border-line bg-panel p-6 hover:border-arc/50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-ink text-arc group-hover:border-arc/50">
                    <Glyph name={s.icon as GlyphName} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-fg">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <CTABand title="Want to work with a tool room that sweats the tolerances?" />
    </>
  )
}

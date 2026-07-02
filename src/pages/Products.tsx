import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useSEO } from '@/lib/seo'
import { productCategories } from '@/data/site'
import { Section, Eyebrow } from '@/components/ui/Section'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Chip } from '@/components/ui/Chip'
import { Glyph, type GlyphName } from '@/components/visuals/Glyph'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/sections/CTABand'

const catIcon: Record<string, GlyphName> = {
  'tools-and-dies': 'die',
  'fixtures-and-gauges': 'fixture',
  'die-elements': 'press',
}

export default function Products() {
  useSEO(
    'Products',
    'Press tools and dies (progressive, forming, blanking, piercing), milling and reaming fixtures, inspection gauges, and precision-ground die elements from Parth Tooling.',
  )

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={
          <>
            Tooling that turns flat stock into <span className="text-arc-gradient">finished parts.</span>
          </>
        }
        intro="Three product families — dies that stamp, fixtures that locate and inspect, and the precision-ground elements inside them all."
      >
        <div className="flex flex-wrap gap-2.5">
          {productCategories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-arc/50 hover:text-fg"
            >
              {c.index} · {c.title}
            </a>
          ))}
        </div>
      </PageHeader>

      {productCategories.map((cat, ci) => (
        <Section key={cat.id} id={cat.id} tone={ci % 2 === 1 ? 'panel' : 'base'}>
          <div className="container-x">
            <Reveal>
              <div className="flex items-start gap-6">
                <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-line bg-ink text-arc sm:flex">
                  <Glyph name={catIcon[cat.id]} className="h-9 w-9" />
                </div>
                <div>
                  <Eyebrow>Family {cat.index}</Eyebrow>
                  <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">{cat.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{cat.summary}</p>
                </div>
              </div>
            </Reveal>

            {cat.note && (
              <Reveal delay={0.05}>
                <div className="mt-8 flex items-start gap-3 rounded-xl border border-ember/25 bg-ember/[0.06] p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-ember-bright" />
                  <p className="text-sm text-muted">{cat.note}</p>
                </div>
              </Reveal>
            )}

            <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cat.items.map((p, i) => (
                <StaggerItem key={p.name} className="h-full">
                  <article className="lift group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 hover:border-arc/50 hover:shadow-glow-arc">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-ink text-arc group-hover:border-arc/50">
                        <Glyph name={catIcon[cat.id]} className="h-7 w-7" />
                      </div>
                      <span className="font-mono text-xs text-faint">
                        {cat.index}.{String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-fg">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.desc}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Section>
      ))}

      <Section className="pt-0">
        <div className="container-x">
          <Reveal>
            <div className="rounded-2xl border border-line bg-panel p-8 text-center sm:p-10">
              <p className="text-lg text-fg">
                Don’t see your exact tool? We build to your drawing.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
                Send a part drawing or a sample and we’ll engineer the tooling around it — from
                concept and design through to tryout and production.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ember-bright"
              >
                Discuss your part
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABand />
    </>
  )
}

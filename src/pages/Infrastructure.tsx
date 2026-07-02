import { CheckCircle2, MapPin } from 'lucide-react'
import { useSEO } from '@/lib/seo'
import { company, machineGroups } from '@/data/site'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Chip } from '@/components/ui/Chip'
import { DimensionDivider } from '@/components/ui/DimensionDivider'
import { Glyph } from '@/components/visuals/Glyph'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/sections/CTABand'

const totalMachines = machineGroups.reduce((n, g) => n + g.machines.length, 0)

export default function Infrastructure() {
  useSEO(
    'Infrastructure',
    'Parth Tooling runs Doosan, BFW and Lokesh VMCs, Electronica wire-cut EDM, precision grinding, a power press and a Mitutoyo CMM metrology lab in MIDC Waluj, Aurangabad.',
  )

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title={
          <>
            A tool room built for <span className="text-arc-gradient">precision.</span>
          </>
        }
        intro="CNC machining, wire-cut EDM, precision grinding, pressing and a dedicated metrology lab — the capability to take a die from raw block to proven, in-tolerance tooling under one roof."
      >
        <div className="flex flex-wrap gap-2.5">
          <Chip tone="arc">{totalMachines} machines</Chip>
          <Chip tone="arc">{machineGroups.length} disciplines</Chip>
          <Chip>Metrology lab</Chip>
          <Chip>{company.iso}</Chip>
        </div>
      </PageHeader>

      <DimensionDivider label={`${totalMachines} machines · ${machineGroups.length} disciplines · 1 roof`} />

      <Section className="pt-16">
        <div className="container-x">
          <Stagger className="grid gap-4 lg:grid-cols-2">
            {machineGroups.map((g) => (
              <StaggerItem key={g.id} className="h-full">
                <div className="lift flex h-full flex-col rounded-2xl border border-line bg-panel p-7 hover:border-arc/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line bg-ink text-arc">
                      <Glyph name={g.kind} className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-fg">{g.title}</h2>
                        <span className="font-mono text-[0.7rem] text-faint">
                          {String(g.machines.length).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{g.blurb}</p>
                    </div>
                  </div>

                  <ul className="mt-6 grid gap-2 border-t border-line pt-5 sm:grid-cols-2">
                    {g.machines.map((m, i) => (
                      <li key={`${m.name}-${i}`} className="flex items-baseline gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-arc/60" aria-hidden="true" />
                        <span className="text-sm text-fg">
                          {m.name}
                          {m.make && <span className="ml-1.5 font-mono text-xs text-faint">· {m.make}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Metrology highlight */}
      <Section tone="panel">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Quality, proven"
              title="Measured, not assumed."
              intro="Every critical dimension is checked in our metrology lab and recorded — so the tooling we ship performs the same on your press as it did on ours."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-3">
              {[
                'CMM inspection with Mitutoyo coordinate measuring',
                'Hardness testing on tool steels and inserts',
                'Bore, height and dial-gauge verification',
                'Digital vernier and micrometer measurement',
                'Documented, repeatable quality records',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 rounded-xl border border-line bg-panel p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-arc" />
                  <span className="text-sm text-fg">{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Facility */}
      <Section className="pt-0">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-panel p-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-arc" />
                <div>
                  <h3 className="text-base font-semibold text-fg">Our facility</h3>
                  <p className="mt-1 text-sm text-muted">
                    {company.address.line1}, {company.address.line2}, {company.address.city}-
                    {company.address.pin}, {company.address.state}
                  </p>
                </div>
              </div>
              <Chip tone="arc">MIDC Waluj</Chip>
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABand title="Need tooling this shop can build?" />
    </>
  )
}

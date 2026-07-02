import { useSEO } from '@/lib/seo'
import { clients, industries } from '@/data/site'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Chip } from '@/components/ui/Chip'
import { ClientMark } from '@/components/ui/ClientMark'
import { DimensionDivider } from '@/components/ui/DimensionDivider'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/sections/CTABand'

export default function Clients() {
  useSEO(
    'Clients',
    'Parth Tooling supplies tooling to Godrej, Schneider Electric, Wipro, John Deere, Mahindra, Bajaj, JBM Group and Sanjeev Auto — as a Tier-1 and Tier-2 OEM partner.',
  )

  return (
    <>
      <PageHeader
        eyebrow="Clients"
        title={
          <>
            Trusted where parts can’t be <span className="text-arc-gradient">out of spec.</span>
          </>
        }
        intro="We supply tooling to some of India’s most demanding manufacturers — including Tier-1 and Tier-2 programs where quality and delivery are non-negotiable."
      >
        <div className="flex flex-wrap gap-2.5">
          <Chip tone="arc">{clients.length} OEM partners</Chip>
          <Chip>Tier-1 & Tier-2 supplier</Chip>
        </div>
      </PageHeader>

      <DimensionDivider label="Godrej · Schneider · Wipro · John Deere · Mahindra · Bajaj" />

      <Section className="pt-16">
        <div className="container-x">
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {clients.map((c) => (
              <StaggerItem key={c.name} className="h-full">
                <ClientMark name={c.name} tier={c.tier} className="h-full" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Statement */}
      <Section tone="panel" className="py-20">
        <div className="container-x">
          <Reveal>
            <div className="steel-panel mx-auto max-w-3xl rounded-3xl border border-line px-6 py-14 text-center sm:px-14">
              <p className="font-display text-2xl font-medium leading-snug text-fg sm:text-3xl">
                Dedicated to exceptional service — and quality parts you can rely on.
              </p>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted">
                Long-term relationships are built one on-time, in-tolerance delivery at a time. That’s
                the standard we hold ourselves to on every program, for every customer.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Industries */}
      <Section className="pt-0">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Industries served"
            title="Tooling across sectors."
          />
          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm text-fg"
              >
                {ind}
              </span>
            ))}
          </Reveal>
        </div>
      </Section>

      <CTABand title="Join the OEMs who build with us." />
    </>
  )
}

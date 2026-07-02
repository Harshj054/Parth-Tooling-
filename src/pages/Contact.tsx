import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useSEO } from '@/lib/seo'
import { company } from '@/data/site'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { PageHeader } from '@/components/sections/PageHeader'
import { ContactForm } from '@/components/sections/ContactForm'

const mapSrc =
  'https://www.google.com/maps?q=MIDC+Waluj+Aurangabad+431136+Maharashtra&output=embed'

export default function Contact() {
  useSEO(
    'Contact',
    `Contact Parth Tooling Pvt Ltd — ${company.phone}, ${company.email}. Tool room at MIDC Waluj, Aurangabad-431136, Maharashtra.`,
  )

  const details = [
    { icon: Phone, label: 'Phone', value: company.phone, href: company.phoneHref },
    { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
    {
      icon: MapPin,
      label: 'Address',
      value: `${company.address.line1}, ${company.address.line2}, ${company.address.city}-${company.address.pin}, ${company.address.state}`,
    },
    { icon: Clock, label: 'Hours', value: 'Mon – Sat · 9:30 – 18:30 IST' },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let’s build your <span className="text-arc-gradient">tooling.</span>
          </>
        }
        intro="Send your part drawing or describe the job. We’ll come back with an approach, a timeline and a quote — usually within a working day."
      />

      <Section className="pt-4">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-2xl border border-line bg-panel p-7">
                <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
                  Reach us directly
                </h2>
                <ul className="mt-5 space-y-4">
                  {details.map((d) => (
                    <li key={d.label} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-ink text-arc">
                        <d.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-faint">{d.label}</p>
                        {d.href ? (
                          <a href={d.href} className="text-sm text-fg transition-colors hover:text-arc">
                            {d.value}
                          </a>
                        ) : (
                          <p className="text-sm text-fg">{d.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-2xl border border-line bg-panel">
                <iframe
                  title="Parth Tooling location — MIDC Waluj, Aurangabad"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full"
                  style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) brightness(0.95)' }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}

import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'
import { company } from '@/data/site'
import { Logo } from '@/components/brand/Logo'

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'Overview', to: '/about#overview' },
      { label: 'Introduction', to: '/about#introduction' },
      { label: 'Philosophy', to: '/about#philosophy' },
      { label: 'Services', to: '/about#services' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Tools & Dies', to: '/products#tools-and-dies' },
      { label: 'Fixtures & Gauges', to: '/products#fixtures-and-gauges' },
      { label: 'Die Elements', to: '/products#die-elements' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Infrastructure', to: '/infrastructure' },
      { label: 'Clients', to: '/clients' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-graphite">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Designing and building press tools, dies, jigs and fixtures to micron precision since {company.established}.
              An {company.iso} certified tool room in MIDC Waluj, Aurangabad.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href={company.phoneHref} className="flex items-center gap-3 text-muted transition-colors hover:text-fg">
                <Phone className="h-4 w-4 shrink-0 text-arc" /> {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-muted transition-colors hover:text-fg">
                <Mail className="h-4 w-4 shrink-0 text-arc" /> {company.email}
              </a>
              <p className="flex items-start gap-3 text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-arc" />
                <span>
                  {company.address.line1}, {company.address.line2}, {company.address.city}-{company.address.pin},{' '}
                  {company.address.state}
                </span>
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-faint">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted transition-colors hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p className="font-mono tracking-wide">
            {company.iso} &nbsp;·&nbsp; CIN {company.cin} &nbsp;·&nbsp; GSTIN {company.gstin}
          </p>
        </div>
      </div>
    </footer>
  )
}

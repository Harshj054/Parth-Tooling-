import { ArrowRight, Phone } from 'lucide-react'
import { company } from '@/data/site'
import { Section, Eyebrow } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { Sparks } from '@/components/visuals/Sparks'

export function CTABand({
  title = 'Have a tooling requirement?',
  intro = 'Send us your part drawing or describe the job. We will come back with an approach, a timeline and a quote.',
}: {
  title?: string
  intro?: string
}) {
  return (
    <Section>
      <div className="container-x">
        <div className="steel-panel relative overflow-hidden rounded-3xl border border-line px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
          <Sparks />
          <Reveal className="relative">
            <Eyebrow className="justify-center">Start a project</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-fg sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">{intro}</p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button to="/contact" size="lg" className="w-full sm:w-auto">
                Get a Quote <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
              <Button href={company.phoneHref} variant="secondary" size="lg" className="w-full sm:w-auto">
                <Phone className="h-4 w-4" /> {company.phone}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

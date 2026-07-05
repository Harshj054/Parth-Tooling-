import { useSEO } from '@/lib/seo'
import { PageHeader } from '@/components/sections/PageHeader'
import { ProductShowcase } from '@/components/showcase/ProductShowcase'
import { CTABand } from '@/components/sections/CTABand'

export default function Showcase() {
  useSEO(
    '3D Showcase',
    'Explore Parth Tooling components in real-time 3D — watch each part formed on the press, then rotate the finished piece in your browser, straight from our CAD.',
  )

  return (
    <>
      <PageHeader
        eyebrow="Interactive 3D"
        title={
          <>
            One machine. <span className="text-arc-gradient">Every part.</span>
          </>
        }
        intro="Pick a component to watch it formed — then take the finished part in your hands and turn it over in real-time 3D, straight from our CAD."
      />

      <ProductShowcase />

      <CTABand />
    </>
  )
}

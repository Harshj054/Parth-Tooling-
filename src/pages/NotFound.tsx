import { useSEO } from '@/lib/seo'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  useSEO('Page not found', 'The page you were looking for could not be found.')

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
      <div className="blueprint-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-x relative text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-arc">PT-404 · Path not found</p>
        <h1 className="mt-6 font-display text-7xl font-bold text-fg sm:text-9xl">404</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          This dimension is out of tolerance — the page you were looking for isn’t here.
        </p>
        <div className="mt-9 flex justify-center">
          <Button to="/" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  )
}

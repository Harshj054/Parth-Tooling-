import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { company, nav } from '@/data/site'
import { cn } from '@/lib/utils'
import { getLenis } from '@/lib/lenis'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setMobileOpen(false), [location.pathname, location.hash])

  // Lock scroll + ESC-to-close while the mobile sheet is open. Lenis runs its
  // own virtual scroll, so we must stop it (setting body overflow alone doesn't
  // hold) and also lock the body for the reduced-motion / no-Lenis path.
  useEffect(() => {
    if (!mobileOpen) return
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const solid = scrolled || mobileOpen

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        solid ? 'border-line bg-ink/80 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive ? 'text-fg' : 'text-muted hover:text-fg',
                    )
                  }
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </NavLink>
                <div
                  className={cn(
                    'invisible absolute left-0 top-full w-80 translate-y-1 pt-3 opacity-0 transition',
                    'duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
                    'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
                  )}
                >
                  <div className="steel-panel rounded-xl border border-line p-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="block text-sm font-medium text-fg">{c.label}</span>
                        {c.desc && <span className="mt-0.5 block text-xs text-muted">{c.desc}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button to="/contact" size="md" className="hidden sm:inline-flex">
            Get a Quote
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-fg lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              data-lenis-prevent
              className="container-x max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-line bg-ink pb-8 pt-6"
            >
              <nav className="flex flex-col" aria-label="Mobile">
                {nav.map((item) => (
                  <div key={item.label} className="border-b border-line/60 py-1">
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block py-3 text-base font-medium',
                          isActive ? 'text-arc' : 'text-fg',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                    {item.children && (
                      <div className="mb-2 flex flex-col gap-1 pl-4">
                        {item.children.map((c) => (
                          <Link key={c.to} to={c.to} className="py-1.5 text-sm text-muted">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                <Button to="/contact" size="lg">
                  Get a Quote
                </Button>
                <a
                  href={company.phoneHref}
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted"
                >
                  <Phone className="h-4 w-4" /> {company.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

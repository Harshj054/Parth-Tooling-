import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLenis } from '@/lib/lenis'

/** On navigation: scroll to a hash target if present, otherwise reset to top.
 *  Routes through Lenis when smooth scrolling is active, else native scroll.
 *  Owns all route-driven scrolling so pages don't fight over it. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const lenis = getLenis()

    if (hash) {
      // Wait a frame so the target section is mounted, then scroll to it.
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -72 })
          else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (lenis) {
          lenis.scrollTo(0, { immediate: true })
        } else {
          window.scrollTo({ top: 0 })
        }
      })
      return () => cancelAnimationFrame(raf)
    }

    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}

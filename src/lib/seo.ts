import { useEffect } from 'react'

const BASE_TITLE = 'Parth Tooling Pvt Ltd'

function setMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Lightweight per-page metadata for this SPA — sets the document title and
 * description on mount. Keeps things dependency-free; swap for react-helmet
 * or migrate to Next.js if server-rendered meta becomes a requirement.
 */
export function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE_TITLE}` : `${BASE_TITLE} — Precision Press Tools & Dies`
    setMeta('description', description)
  }, [title, description])
}

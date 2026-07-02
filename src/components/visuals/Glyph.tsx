import type { ReactNode } from 'react'
import type { IconKey, IconKeyMachine } from '@/data/site'

export type GlyphName =
  | Extract<IconKey, 'press' | 'die' | 'fixture' | 'sheet' | 'mould' | 'lift'>
  | IconKeyMachine

/**
 * A single, cohesive hand-drawn technical-line icon family. Every glyph shares
 * the same 32×32 grid, 1.5px round stroke and currentColor — so services and
 * machines read as one system. Grounded in real tooling, not generic clip-art.
 */
export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const paths: Record<GlyphName, ReactNode> = {
  // ---- Services / tooling (note: 'press' also serves the power-press machine) ----
  press: (
    <>
      <rect x="6" y="4" width="20" height="4.5" rx="1" />
      <path d="M10 8.5V20M22 8.5V20" strokeOpacity="0.5" />
      <path d="M16 9v8" />
      <path d="M5 17.6h22" />
      <rect x="6" y="20" width="20" height="5" rx="1" />
    </>
  ),
  die: (
    <>
      <rect x="5" y="6" width="22" height="4.5" rx="1" />
      <rect x="14.4" y="10.5" width="3.2" height="6" rx="0.5" />
      <rect x="5" y="21" width="22" height="4.5" rx="1" />
      <path d="M16 3v3M16 26v3" strokeOpacity="0.45" strokeDasharray="1 2" />
    </>
  ),
  fixture: (
    <>
      <rect x="4" y="21" width="24" height="5" rx="1" />
      <circle cx="15" cy="14" r="5" />
      <path d="M26 8.5V13H20" />
      <path d="M9 21v-3M22 21v-3" strokeOpacity="0.55" />
    </>
  ),
  sheet: (
    <>
      <path d="M6 21 21 21 26 15 11 15Z" />
      <path d="M21 21v5l5-6" strokeOpacity="0.6" />
      <circle cx="14" cy="18" r="0.9" />
      <circle cx="18.5" cy="18" r="0.9" />
    </>
  ),
  mould: (
    <>
      <rect x="4" y="8" width="11" height="16" rx="1" />
      <rect x="17" y="8" width="11" height="16" rx="1" />
      <circle cx="16" cy="16" r="4" />
      <path d="M16 6v3M16 23v3" strokeOpacity="0.5" strokeDasharray="1 2" />
    </>
  ),
  lift: (
    <>
      <circle cx="16" cy="7" r="3" />
      <path d="M16 10v6" />
      <path d="M16 16c0 6 8 6.5 7.5 0.5" />
      <path d="M23.5 16.5 21.8 18" />
    </>
  ),
  // ---- Machines ----
  vmc: (
    <>
      <rect x="4" y="22" width="24" height="4" rx="0.5" />
      <rect x="23" y="5" width="4" height="17" rx="0.5" />
      <rect x="11" y="7" width="13" height="3.5" rx="0.5" />
      <path d="M14 10.5V17" />
      <rect x="13" y="17" width="2" height="2" />
      <rect x="9" y="18" width="7" height="4" rx="0.5" />
    </>
  ),
  edm: (
    <>
      <rect x="5" y="5" width="16" height="3" rx="0.5" />
      <rect x="5" y="24" width="16" height="3" rx="0.5" />
      <path d="M13 8v16" />
      <rect x="8" y="13" width="11" height="7" rx="0.5" />
      <circle cx="15" cy="16" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="11" cy="18.5" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  grind: (
    <>
      <circle cx="15" cy="11" r="6" />
      <circle cx="15" cy="11" r="1.3" />
      <rect x="4" y="22" width="24" height="3" rx="0.5" />
      <rect x="9" y="19" width="12" height="3" rx="0.5" />
      <path d="M14 17 10 20M15 17.5 12 21M13 16.5 9 18.5" strokeOpacity="0.7" />
    </>
  ),
  cmm: (
    <>
      <rect x="4" y="24" width="24" height="3" rx="0.5" />
      <path d="M8 9v15M24 9v15" />
      <rect x="6" y="7" width="20" height="3" rx="0.5" />
      <rect x="14" y="7" width="4" height="3" />
      <path d="M16 10v8" />
      <circle cx="16" cy="19" r="1.3" />
      <rect x="12" y="20" width="8" height="4" rx="0.5" />
    </>
  ),
  drill: (
    <>
      <rect x="6" y="23" width="18" height="3" rx="0.5" />
      <rect x="20" y="5" width="4" height="18" rx="0.5" />
      <rect x="11" y="6" width="10" height="4" rx="0.5" />
      <path d="M15 10v7" />
      <path d="M13.6 17h2.8L15 19.4Z" />
      <rect x="9" y="18" width="9" height="3" rx="0.5" />
    </>
  ),
}

# Parth Tooling Pvt Ltd — Website

A premium marketing website for **Parth Tooling Pvt Ltd**, a precision press-tools,
dies, jigs & fixtures manufacturer (ISO 9001:2015, Aurangabad).

**Design language — "Precision Forge":** a dark-industrial / steel aesthetic with a
dual *arc-blue + molten-ember* thermal accent (grounded in arc welding & heat
treatment), an animated engineering-blueprint hero, and recurring dimension-line /
tolerance motifs. Space Grotesk + Inter + JetBrains Mono.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (custom design tokens in `tailwind.config.js`)
- **Framer Motion** for animation (all transform/opacity; honors `prefers-reduced-motion`)
- **React Router** (multi-page, lazy-loaded routes)
- **lucide-react** for UI icons; custom SVG for the domain/machine iconography

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # typecheck + production build to dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  data/site.ts            # SINGLE SOURCE OF TRUTH — all company content
  lib/                    # motion variants, SEO hook, utils
  components/
    brand/                # logo mark + wordmark
    visuals/              # HeroBlueprint, Glyph (icons), Crosshair, Sparks
    ui/                   # Button, Section, Reveal, DimensionDivider, StatCounter…
    layout/               # Navbar (mega-menu), Footer, Layout, ScrollManager
    sections/             # Hero, PageHeader, CTABand, ContactForm
  pages/                  # Home, About, Products, Infrastructure, Clients, Contact, 404
```

## Customizing

**Content** — edit `src/data/site.ts`. Company details, nav, products, machines,
clients, services and QCDMS principles all live there; the pages render from it.

**Contact form** — the form in `src/components/sections/ContactForm.tsx` posts to
`FORM_ENDPOINT` (set it in `src/data/site.ts`). Until you set it, the form runs in
demo mode (validates + shows success, sends nothing). To receive submissions,
create a free [Formspree](https://formspree.io) form and paste its endpoint:

```ts
export const FORM_ENDPOINT: string = 'https://formspree.io/f/xxxxxxxx'
```

Any backend that accepts a JSON `POST` works too.

**Design tokens** — colors, fonts, shadows and animations are in
`tailwind.config.js`. Global styles / textures are in `src/index.css`.

**Adding a real logo & photos** — the current build ships fully custom SVG visuals
(no third-party images). To use real assets later:
- Replace the mark in `src/components/brand/Logo.tsx`.
- Drop product / machine / factory photos into `src/assets/` and use them in the
  relevant page (e.g. the Products cards or a swap for `HeroBlueprint`).
- Replace the typographic client "logos" in `src/components/ui/ClientMark.tsx` with
  official brand artwork **only if you have permission** to use it.

## Deploying

Builds to a static `dist/` — deploy to Vercel, Netlify, Cloudflare Pages, etc.
SPA routing rewrites are already included (`vercel.json` and `public/_redirects`)
so deep links like `/products` don't 404 on refresh.

## Notes

- Accessibility: skip link, keyboard-navigable mega-menu (focus-within), visible
  focus rings, labelled form fields with inline validation, `prefers-reduced-motion`
  respected throughout.
- Performance: route-level code splitting, lazy map iframe, compositor-only
  animations, `font-display: swap`.
- The site is **dark-only** by design — a light theme would undercut the steel
  identity.

Content sourced from parthtooling.com. Third-party client names are referenced for
identification only.

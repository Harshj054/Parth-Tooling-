/* ============================================================
   Manufacturing showcase — the interactive "one machine, every
   part" gallery. Each entry drives a card + the press→3D viewer.
   A part becomes fully interactive the moment it has a `model`
   (a GLB tessellated from the client's STEP/CAD). Until then the
   card still plays the forming sequence and reads as "in production".
   ============================================================ */

import type { BlankShape } from '@/components/showcase/ForgeScene'

export type ShowcasePart = {
  id: string
  name: string
  category: string
  material: string
  process: string
  tolerance: string
  dim: string
  blurb: string
  /** Raw stock shape shown feeding the die. */
  blank: BlankShape
  /** Web-optimized GLB in /public/models. Present → live 3D. */
  model?: string
}

export const showcaseParts: ShowcasePart[] = [
  {
    id: 'impeller',
    name: 'Centrifugal Impeller',
    category: 'Precision machined',
    material: 'SS 304',
    process: 'Cast · 5-axis machined',
    tolerance: '±0.02 mm',
    dim: 'Ø 192 mm',
    blurb: 'Six-vane closed impeller for industrial pump assemblies — balanced and flow-tested.',
    blank: 'billet',
    model: '/models/impeller.glb',
  },
  {
    id: 'progressive-bracket',
    name: 'Mounting Bracket',
    category: 'Progressive stamping',
    material: 'CRCA 2.0 mm',
    process: 'Progressive die · 6 station',
    tolerance: '±0.05 mm',
    dim: '120 × 80 mm',
    blurb: 'Formed and pierced in a single strip pass — holes, bends and embossed ribs in one hit.',
    blank: 'strip',
  },
  {
    id: 'busbar-terminal',
    name: 'Busbar Terminal',
    category: 'Electrical stamping',
    material: 'Copper C11000',
    process: 'Blank · form · plate',
    tolerance: '±0.03 mm',
    dim: '64 × 22 mm',
    blurb: 'High-conductivity terminal with controlled bend radius and plated contact face.',
    blank: 'strip',
  },
  {
    id: 'motor-lamination',
    name: 'Stator Lamination',
    category: 'Precision blanking',
    material: 'Electrical steel 0.5 mm',
    process: 'Compound die · stacked',
    tolerance: '±0.015 mm',
    dim: 'Ø 96 mm',
    blurb: 'Burr-controlled laminations blanked and stacked into a motor core.',
    blank: 'disc',
  },
  {
    id: 'sensor-housing',
    name: 'Sensor Housing',
    category: 'Deep draw',
    material: 'Aluminium 5052',
    process: 'Draw · trim · CNC',
    tolerance: '±0.04 mm',
    dim: 'Ø 34 × 28 mm',
    blurb: 'Deep-drawn shell with a machined sealing land for automotive sensors.',
    blank: 'disc',
  },
  {
    id: 'fixture-base',
    name: 'Inspection Fixture',
    category: 'Jigs & fixtures',
    material: 'Tool steel · hardened',
    process: 'CNC · ground · lapped',
    tolerance: '±0.005 mm',
    dim: '160 × 120 mm',
    blurb: 'Locating fixture that makes a batch measurable — datums ground and lapped.',
    blank: 'billet',
  },
]

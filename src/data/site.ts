/* ============================================================
   Single source of truth for Parth Tooling content.
   Sourced from parthtooling.com (Overview, Introduction,
   Philosophy, Services, Infrastructure, Products, Clients).
   ============================================================ */

export const company = {
  name: 'Parth Tooling',
  legalName: 'Parth Tooling Pvt Ltd',
  tagline: 'Tooling engineered to micron precision.',
  established: 2010,
  iso: 'ISO 9001:2015',
  employees: 20,
  associate: 'Prerna Engineering',
  gstin: '27AAFCP7147P1ZP',
  cin: 'U36993MH2010PTC207089',
  phone: '+91 99232 57704',
  phoneHref: 'tel:+919923257704',
  email: 'mdmakde.parth@gmail.com',
  address: {
    line1: 'Gut No 43, Plot No 6 & 6A',
    line2: 'Behind Siemens Company, MIDC Waluj',
    city: 'Aurangabad',
    pin: '431136',
    state: 'Maharashtra, India',
  },
  directors: ['Mulchand Makde', 'Promesh Makde', 'Gopal Makde'],
} as const

export const stats = [
  { value: 2010, display: 'Est. 2010', label: 'Precision tooling', suffix: '', kind: 'year' },
  { value: 15, display: '15+', label: 'Years in tool & die', suffix: '+', kind: 'count' },
  { value: 12, display: '12', label: 'CNC & precision machines', suffix: '', kind: 'count' },
  { value: 8, display: '8', label: 'Tier-1 OEM partners', suffix: '', kind: 'count' },
] as const

export type NavChild = { label: string; to: string; desc?: string }
export type NavItem = { label: string; to: string; children?: NavChild[] }

export const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Company',
    to: '/about',
    children: [
      { label: 'Overview', to: '/about#overview', desc: 'Who we are, at a glance' },
      { label: 'Introduction', to: '/about#introduction', desc: 'Our QCDMS operating principles' },
      { label: 'Philosophy', to: '/about#philosophy', desc: 'Respect for individuals, value for society' },
      { label: 'Services', to: '/about#services', desc: 'What we deliver, end to end' },
    ],
  },
  {
    label: 'Products',
    to: '/products',
    children: [
      { label: 'Tools & Dies', to: '/products#tools-and-dies', desc: 'Progressive, forming, blanking, piercing' },
      { label: 'Fixtures & Gauges', to: '/products#fixtures-and-gauges', desc: 'Milling & reaming fixtures, gauges' },
      { label: 'Die Elements', to: '/products#die-elements', desc: 'Punches, buttons, pillars & bushes' },
    ],
  },
  { label: '3D Showcase', to: '/showcase' },
  { label: 'Infrastructure', to: '/infrastructure' },
  { label: 'Clients', to: '/clients' },
  { label: 'Contact', to: '/contact' },
]

export type IconKey =
  | 'press'
  | 'die'
  | 'fixture'
  | 'sheet'
  | 'mould'
  | 'lift'
  | 'quality'
  | 'cost'
  | 'delivery'
  | 'management'
  | 'safety'

export type Service = { title: string; blurb: string; icon: IconKey }

export const services: Service[] = [
  {
    title: 'Press Tools',
    blurb: 'Design and build of press tools that stamp accurate, repeatable sheet-metal parts at production volume.',
    icon: 'press',
  },
  {
    title: 'Dies',
    blurb: 'Progressive, forming, blanking and piercing dies built to hold tolerance across long production runs.',
    icon: 'die',
  },
  {
    title: 'Jigs & Fixtures',
    blurb: 'Machining and inspection fixtures that locate, clamp and repeat — so every part comes off the same.',
    icon: 'fixture',
  },
  {
    title: 'Sheet Metal Components',
    blurb: 'Manufacture and supply of finished sheet-metal components using our own tooling.',
    icon: 'sheet',
  },
  {
    title: 'Compression Moulds',
    blurb: 'Compression moulds engineered for consistent fill, cure and release in industrial production.',
    icon: 'mould',
  },
  {
    title: 'Lifting Equipment',
    blurb: 'Supply of lifting equipment to industry, backed by the same quality and delivery guarantees.',
    icon: 'lift',
  },
]

export type Product = { name: string; desc: string; tags: string[] }
export type ProductCategory = {
  id: string
  title: string
  index: string
  summary: string
  items: Product[]
  note?: string
}

export const productCategories: ProductCategory[] = [
  {
    id: 'tools-and-dies',
    index: '01',
    title: 'Tools & Dies',
    summary:
      'The core of the shop — dies that convert flat stock into finished, in-tolerance parts, run after run.',
    items: [
      {
        name: 'Progressive Die',
        desc: 'Multi-station tooling that pierces, forms and cuts in sequence as strip advances — high volume, low cost per part.',
        tags: ['High volume', 'Multi-station', 'Strip feed'],
      },
      {
        name: 'Forming Die',
        desc: 'Bends and draws sheet metal into 3-D geometry while holding wall thickness and profile.',
        tags: ['Bending', 'Drawing', 'Profile control'],
      },
      {
        name: 'Blanking Die',
        desc: 'Produces clean, burr-controlled blanks as the starting stock for downstream operations.',
        tags: ['Clean edge', 'Repeatable', 'Nesting-optimised'],
      },
      {
        name: 'Piercing Die',
        desc: 'Punches accurately located holes and features to tight positional tolerance.',
        tags: ['Positional accuracy', 'Multi-hole', 'Long tool life'],
      },
    ],
  },
  {
    id: 'fixtures-and-gauges',
    index: '02',
    title: 'Fixtures & Gauges',
    summary:
      'Repeatability, built as hardware. Fixtures that locate and clamp; gauges that make quality measurable.',
    items: [
      {
        name: 'Milling Fixture',
        desc: 'Locates and clamps components for milling so cutter paths stay true across a batch.',
        tags: ['Rigid clamping', 'Fast load', 'Batch accuracy'],
      },
      {
        name: 'Reaming Fixture',
        desc: 'Guides reaming operations for precise, concentric, repeatable bores.',
        tags: ['Concentricity', 'Bore accuracy', 'Guided'],
      },
      {
        name: 'Inspection Gauges',
        desc: 'Go / no-go and functional gauges that turn tolerance into a pass-or-fail check on the floor.',
        tags: ['Go / no-go', 'Functional', 'Shop-floor'],
      },
    ],
  },
  {
    id: 'die-elements',
    index: '03',
    title: 'Die Elements',
    summary:
      'The precision-ground building blocks that go inside every die and fixture we build.',
    note: 'Detailed die-element catalogue is being updated. Reach out for current specifications and lead times.',
    items: [
      {
        name: 'Punches',
        desc: 'Hardened, precision-ground punches profiled for piercing, blanking and forming stations.',
        tags: ['Hardened', 'Ground', 'Profiled'],
      },
      {
        name: 'Die Buttons',
        desc: 'Matched die buttons and inserts that pair with punches to control clearance and edge quality.',
        tags: ['Matched clearance', 'Wear-resistant'],
      },
      {
        name: 'Guide Pillars & Bushes',
        desc: 'Guide pillar-and-bush sets that keep upper and lower halves in precise alignment through every stroke.',
        tags: ['Alignment', 'Long life'],
      },
      {
        name: 'Springs & Strippers',
        desc: 'Stripper plates and spring elements that control the strip and release parts cleanly.',
        tags: ['Stripping', 'Strip control'],
      },
    ],
  },
]

export type MachineGroup = {
  id: string
  title: string
  kind: IconKeyMachine
  blurb: string
  machines: { name: string; make?: string; spec?: string }[]
}
export type IconKeyMachine = 'vmc' | 'edm' | 'grind' | 'press' | 'cmm' | 'drill'

export const machineGroups: MachineGroup[] = [
  {
    id: 'machining',
    title: 'CNC Machining',
    kind: 'vmc',
    blurb: 'Vertical machining centres and conventional mills for roughing through finish cuts.',
    machines: [
      { name: 'VMC', make: 'Doosan DNM 5700' },
      { name: 'VMC', make: 'BFW Agni ++' },
      { name: 'VMC', make: 'Lokesh VML-800' },
      { name: 'DRO Milling Machine' },
      { name: 'Radial Drill Machine' },
      { name: 'Tapping Machine' },
    ],
  },
  {
    id: 'edm',
    title: 'Wire-Cut EDM',
    kind: 'edm',
    blurb: 'Wire-cut EDM for hardened profiles, sharp corners and fine detail no cutter can reach.',
    machines: [{ name: 'Wire-Cut EDM', make: 'Electronica Sprintcut' }],
  },
  {
    id: 'grinding',
    title: 'Precision Grinding',
    kind: 'grind',
    blurb: 'Surface and cylindrical grinding for flatness, parallelism and ground finishes.',
    machines: [
      { name: 'Surface Grinding Machine', make: 'John Shipmen' },
      { name: 'Surface Grinding Machine', make: 'Proth' },
      { name: 'Cylindrical Grinding Machine', make: 'Micromatic' },
    ],
  },
  {
    id: 'pressing',
    title: 'Pressing',
    kind: 'press',
    blurb: 'Power press for tryout, sampling and short-run production of stamped parts.',
    machines: [{ name: 'Power Press' }],
  },
  {
    id: 'metrology',
    title: 'Metrology Lab',
    kind: 'cmm',
    blurb: 'A dedicated inspection room so quality is measured, recorded and proven — not assumed.',
    machines: [
      { name: 'CMM', make: 'Mitutoyo' },
      { name: 'Hardness Tester' },
      { name: 'Height Gauge' },
      { name: 'Bore Gauge' },
      { name: 'Digital Vernier Caliper' },
      { name: 'Micrometer' },
      { name: 'Dial Gauge' },
    ],
  },
]

export type Client = { name: string; tier?: string }

export const clients: Client[] = [
  { name: 'Godrej & Boyce' },
  { name: 'Schneider Electric' },
  { name: 'Wipro Enterprises' },
  { name: 'John Deere', tier: 'Tier 1' },
  { name: 'Mahindra', tier: 'Tier 1 & 2' },
  { name: 'Bajaj', tier: 'Tier 1 & 2' },
  { name: 'JBM Group' },
  { name: 'Sanjeev Auto Parts' },
]

export const industries = [
  'Automotive',
  'Electrical & Switchgear',
  'Home Appliances',
  'Agriculture Equipment',
  'General Engineering',
]

export type Principle = { key: string; letter: string; title: string; desc: string; icon: IconKey }

export const qcdms: Principle[] = [
  {
    key: 'quality',
    letter: 'Q',
    title: 'Quality',
    desc: 'A passion for quality, with continuous innovation built into how we work — under an ISO 9001:2015 system.',
    icon: 'quality',
  },
  {
    key: 'cost',
    letter: 'C',
    title: 'Cost',
    desc: 'Superior products at competitive pricing, so quality tooling stays commercially viable for you.',
    icon: 'cost',
  },
  {
    key: 'delivery',
    letter: 'D',
    title: 'Delivery',
    desc: 'On-time, on-budget completion — and a guarantee to deliver within the agreed timeframe.',
    icon: 'delivery',
  },
  {
    key: 'management',
    letter: 'M',
    title: 'Management',
    desc: 'Respect for individuals, transparency and integrity — the basis of long-term relationships.',
    icon: 'management',
  },
  {
    key: 'safety',
    letter: 'S',
    title: 'Safety',
    desc: '"Safety First is Safety Always." Protocols matched to the real needs of every workplace.',
    icon: 'safety',
  },
]

/** Where the contact form posts. Replace with your Formspree endpoint (or any
 *  form backend / API route). Left blank so the form runs in demo mode until set. */
export const FORM_ENDPOINT: string = ''

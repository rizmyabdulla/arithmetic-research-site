/**
 * The product ecosystem.
 *
 * Every product surface on the site (home showcase, /products, /products/[slug],
 * footer, structured data) is generated from this list. To launch a new product:
 *   1. Add an entry below (order = display order).
 *   2. Pick a `motif` for its generated visual, or leave `lattice` as the default.
 *   3. Give it a `theme` — products keep their own identity inside the parent brand.
 * No layout files need to change.
 */

export type ProductStatus = 'live' | 'early-access' | 'in-development';

/** Procedural visual drawn for the product. Add new ones in src/components/visuals/. */
export type ProductMotif = 'routes' | 'waveform' | 'lattice';

export interface Product {
  slug: string;
  name: string;
  status: ProductStatus;
  /** One-line category, e.g. "Field service management". */
  category: string;
  /** The product's own headline, as used on its official website. */
  headline: string;
  /** Short pitch for cards and the home showcase (≈ 30 words). */
  summary: string;
  /** Longer description for the product page. */
  description: string[];
  audience: string[];
  platforms: string[];
  capabilities: { title: string; body: string }[];
  url: string;
  ctaLabel: string;
  motif: ProductMotif;
  theme: {
    /** Background of the product's environment. */
    bg: string;
    /** Slightly raised surface on that background. */
    surface: string;
    /** Main text color on `bg`. */
    ink: string;
    /** Secondary text color on `bg` (keep ≥ 4.5:1 contrast). */
    muted: string;
    /** Brand accent used for marks and large type. */
    accent: string;
    /** Text color to use on top of `accent`. */
    onAccent: string;
    /** 'dark' or 'light' — tells the header which logo color to use. */
    tone: 'dark' | 'light';
  };
}

export const products: Product[] = [
  {
    slug: 'kordify',
    name: 'Kordify',
    status: 'live',
    category: 'AI-powered field service management',
    headline: 'Run field service ops without the chaos.',
    summary:
      'A modular field service platform for dispatchers, technicians and managers — AI-assisted scheduling, live dispatch, offline-first mobile work and an automated quote-to-cash flow.',
    description: [
      'Kordify brings scheduling, dispatch, work orders, inventory, invoicing and customer communication into one multi-tenant platform across iOS, Android and the web.',
      'It is built for real field conditions: technicians keep working without a signal and sync when they reconnect, dispatchers see every job and SLA in real time, and the AI scheduler recommends the right technician while people keep the final say.',
      'Teams switch on only the modules they need — from a single crew to franchise networks where headquarters runs inventory and billing while franchisees work in a simpler interface.',
    ],
    audience: ['HVAC', 'Electrical', 'Plumbing', 'Facilities', 'Industrial compliance', 'Franchise networks'],
    platforms: ['iOS', 'Android', 'Web'],
    capabilities: [
      {
        title: 'AI scheduling optimizer',
        body: 'Recommends technicians by skill match, proximity, availability and workload. Dispatchers stay in control of the final call.',
      },
      {
        title: 'Event-driven dispatch',
        body: 'Drag-and-drop assignment that pushes updates to field units by location, availability and skill tags, with live ETAs and SLA breach warnings.',
      },
      {
        title: 'Offline-first mobile',
        body: 'Accept jobs, capture photos and signatures and scan parts with no connection. Everything syncs when the device is back online.',
      },
      {
        title: 'Quote-to-cash automation',
        body: 'State-machine pipelines connect sales, dispatch, field work and billing, with compliance gates and automatic PDF invoices.',
      },
      {
        title: 'Tenant isolation',
        body: 'Each organization gets its own subdomain, with row-level security separating data on shared infrastructure.',
      },
      {
        title: 'Modular by design',
        body: 'Inventory, customer portal and other modules switch on per tenant, so the product grows with the operation.',
      },
    ],
    url: 'https://getkordify.com/',
    ctaLabel: 'Visit getkordify.com',
    motif: 'routes',
    theme: {
      bg: '#0f141b',
      surface: '#18202a',
      ink: '#f1efe8',
      muted: '#a3a9b3',
      accent: '#f5b301',
      onAccent: '#0f141b',
      tone: 'dark',
    },
  },
  {
    slug: 'voiceagento',
    name: 'VoiceAgento',
    status: 'early-access',
    category: 'AI voice agents with a human desk built in',
    headline: 'AI answers the call. Your team takes it from there.',
    summary:
      'AI voice agents that handle phone and web calls around the clock — and hand the call to a person, with the transcript, summary and caller details on screen, the moment it needs one.',
    description: [
      'VoiceAgento pairs AI call handling with a built-in human agent desk. Routine calls are resolved by the agent; when a caller needs a person, the call reaches your team warm, never as a cold transfer.',
      'Agents are built without code from industry templates and plain-language instructions, grounded in your documents or website, and tested in the browser before they take a real call.',
      'Voice provider, language model, telephony and helpdesk come together as one product — with AI disclosure, per-number recording consent and role-based access designed in from the start.',
    ],
    audience: ['Clinics & practices', 'Real estate', 'E-commerce', 'Home services', 'Agencies', 'Support & sales teams', 'After-hours lines'],
    platforms: ['Phone', 'Web call widget', 'SIP'],
    capabilities: [
      {
        title: 'Human handoff, configured',
        body: 'Hand off when a caller asks for a person, when the AI is unsure, when frustration rises, or on your own rules — into queues with business hours.',
      },
      {
        title: 'No-code agent builder',
        body: 'Start from a template, write instructions in plain language, add knowledge from documents or a website, and test calls in the browser.',
      },
      {
        title: 'Actions mid-call',
        body: 'Book appointments, update the CRM, create tickets and call webhooks while the caller is still on the line.',
      },
      {
        title: 'Phone and web',
        body: 'Buy or port a number, route calls from your carrier over SIP, or add a web call widget with one script tag.',
      },
      {
        title: 'Natural conversations',
        body: 'Multilingual voices, and callers can interrupt the agent the way they would interrupt a person.',
      },
      {
        title: 'One view of every call',
        body: 'AI-resolved and human-handled calls, handoffs, call length and cost per call, with recordings and transcripts attached.',
      },
    ],
    url: 'https://voiceagento.com/',
    ctaLabel: 'Visit voiceagento.com',
    motif: 'waveform',
    theme: {
      bg: '#f7f6f2',
      surface: '#ecebe4',
      ink: '#14231c',
      muted: '#4c5a53',
      accent: '#1f7a55',
      onAccent: '#f7f6f2',
      tone: 'light',
    },
  },
];

export const statusLabel: Record<ProductStatus, string> = {
  live: 'Available now',
  'early-access': 'Early access',
  'in-development': 'In development',
};

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** Subscript digits, used for the x₁, x₂ … product indices. */
export function subscript(n: number) {
  return String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
}

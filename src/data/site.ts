/**
 * Site-wide settings. Everything a non-developer is likely to change lives here
 * or in the other files in `src/data/`.
 */
export const site = {
  name: 'Arithmetic Research',
  shortName: 'Arithmetic',
  url: 'https://arithmeticresearch.com',
  tagline: 'Intelligence, carefully computed.',
  description:
    'Arithmetic Research is a technology company building AI-powered products, intelligent agents and automation software — including Kordify and VoiceAgento.',
  /**
   * Public inbox used by every contact link and by the contact form (which opens
   * the visitor's email client). Change it here and it changes everywhere.
   */
  email: 'hello@arithmeticresearch.com',
  /** Add profiles as they go live, e.g. { label: 'LinkedIn', href: 'https://…' }. */
  social: [] as { label: string; href: string }[],
};

export const nav = [
  { label: 'Products', href: '/products' },
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** Reasons someone might write to us. Drives the contact form and contact page. */
export const inquiryTypes = [
  {
    id: 'customer',
    label: 'Product inquiry',
    blurb: 'Questions about Kordify, VoiceAgento, pricing, demos or fit for your team.',
  },
  {
    id: 'partner',
    label: 'Partnership',
    blurb: 'Integrations, distribution, resellers and joint go-to-market work.',
  },
  {
    id: 'collab',
    label: 'Research & collaboration',
    blurb: 'Engineers, researchers and builders who want to work on hard problems with us.',
  },
  {
    id: 'other',
    label: 'Something else',
    blurb: 'Press, investors, or anything that does not fit the boxes above.',
  },
];

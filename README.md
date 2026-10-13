# Arithmetic Research — website

The official website of [Arithmetic Research](https://arithmeticresearch.com), the company behind
[Kordify](https://getkordify.com/) and [VoiceAgento](https://voiceagento.com/).

Static site built with [Astro](https://astro.build) and [GSAP](https://gsap.com) (ScrollTrigger). No
backend, no tracking.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve the build
npm run check     # type-check .astro and .ts files
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CDN…). Unknown routes are
served by `dist/404.html`.

## Concept

**Ink, paper and a red pen.** The identity is built from arithmetic itself:

- **The mark** is an equals sign with a *carried digit* (the red square): what one result hands to the
  next. It recurs as the hero, the finale, the favicon and the social card.
- **Operators as glyphs.** `+ − × ÷` are drawn from the same rectangles as the mark and stand for what we
  build: agents (add), automation (subtract), AI systems (multiply), software engineering (divide).
- **The red pen** annotates: section markers, hand-drawn circles around key words, focus rings.
- **Graph paper** (`.ledger`) is the surface the company “works on”.
- **Products keep their own identity.** Each product brings its own palette and procedural visual; the
  page environment shifts into it as you scroll.

Type: Inter Tight (display/body), Instrument Serif italic (voice), JetBrains Mono (annotations), all
self-hosted through Fontsource.

## The homepage story

| # | Section | What happens |
|---|---------|--------------|
| 0 | Hero | A particle field assembles into the mark. The first scroll solidifies it, then the two bars open out until they become the paper the rest of the page is written on. |
| 1 | Premise | One statement that resolves word by word with scroll. |
| 2 | What we build | The four operators as a pinned horizontal sequence (desktop) or a stack (mobile). |
| 3 | Ecosystem | The company as a sum (`AR = Σ xₙ`), with an orbit diagram generated from the product list. |
| – | Product chapters | One per product, each in its own colour environment with a procedural visual. |
| 4 | Approach | “Show your work” — the process laid out as a worked sum. |
| 5 | Principles | Axioms. |
| 6 | What comes next | `x₃ = ?` — the open term in the sequence. |
| 7 | Finale | The equals sign closes again; contact. |

## Project structure

```
src/
  data/               ← content lives here
    site.ts           name, URL, contact email, navigation, inquiry types, social links
    products.ts       the product ecosystem (drives every product surface)
    company.ts        operators, approach, principles, research focus areas
  content/notes/      research notebook (Markdown)
  components/
    home/             homepage sections, in story order
    visuals/          procedural product visuals (one per `motif`)
    …                 header, footer, logo, page hero, shared bits
  layouts/Base.astro  <head>, SEO/Open Graph/JSON-LD, header, footer
  pages/              routes
  scripts/
    motion.ts         shared motion system + declarative data-attributes
    hero.ts           the particle hero and first-scroll transition
    story.ts          colour-environment changes between sections
  styles/global.css   design tokens and base styles
public/               favicon, icons, og.png, robots.txt, manifest
scripts/              icon generator and the social-card template
```

## Common changes

### Add a product

Add an entry to `src/data/products.ts`. That one change adds it to the homepage (orbit, chapter, `x₃`
moves to `x₄`), `/products`, a new `/products/<slug>` page, the footer, the mobile menu and the
structured data. Choose a `motif` for its visual (`routes`, `waveform`, or the generic `lattice`); to give
it a bespoke one, add a component in `src/components/visuals/` and a case in `ProductVisual.astro`.

### Publish a research note

Copy `src/content/notes/_template.md` to a new file without the leading underscore and fill in the front
matter. It appears in the notebook on `/research` and gets its own page at `/research/<file-name>`. Until
there are notes, the notebook shows an empty state.

### Change the contact address or social links

Edit `email` and `social` in `src/data/site.ts`.

## How the contact form works

The form validates in the browser and then opens the visitor’s email app with a pre-filled message to
the address in `site.ts` (a `mailto:` link). Nothing is sent to or stored by a server, and the page says
so. To use a form service instead (Formspree, Basin, a serverless function…), replace the submit handler
in `src/pages/contact.astro`.

## Motion, accessibility and performance

- **Declarative motion.** Add `data-split` (masked line reveal), `data-reveal`, `data-stagger`,
  `data-draw`, `data-parallax="0.15"` or wrap a word in `<Pen>`; see `src/scripts/motion.ts`.
- **Native scrolling.** No smooth-scroll hijacking. Pinned sequences are short and always scroll through.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, pins, scrubs, particles and transitions
  are disabled and every section renders in its final state.
- **No-JS / slow JS.** Content is in the HTML. If the motion system has not started within 2.5 s, the
  page falls back to static content.
- **Cost control.** The hero canvas pauses off-screen and in background tabs, caps device pixel ratio
  at 2, scales particle count to the screen and hands over to plain DOM elements after the first scroll.
  All scroll animation uses transforms and opacity. ~45 KB of JS (gzip) in total.
- Semantic landmarks, skip link, visible focus styles, keyboard-operable menu (Esc closes, focus is
  kept inside), labelled form controls with inline errors, and AA contrast for body text.

## Assets

- `public/favicon.svg` is the source icon. Regenerate the PNG icons with `node scripts/icons.mjs`.
- `public/og.png` (1200 × 630) is a capture of `scripts/og.html`; open that file in a browser at
  1200 × 630 to regenerate it.

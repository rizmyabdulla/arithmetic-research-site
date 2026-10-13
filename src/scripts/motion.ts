/**
 * Shared motion system.
 *
 * Declarative hooks (add the attribute, get the behavior):
 *   data-split            Line-by-line masked text reveal.
 *   data-reveal[="up|fade|left|scale"]   Fade/slide in on enter.
 *   data-stagger          Reveal direct children in sequence.
 *   data-pen              Draw the red-pen ellipse (see Pen.astro).
 *   data-parallax="0.2"   Scroll-linked vertical drift; speed is a fraction of the viewport.
 *   data-count-lines      Rules that draw left→right.
 *
 * Section-specific choreography lives next to its component and imports
 * `gsap`, `ScrollTrigger` and `reducedMotion` from here.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 1.1 });

export { gsap, ScrollTrigger };

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

declare global {
  interface Window {
    __arMotion?: boolean;
  }
}

/** Splits an element's text into masked lines. Child elements are kept whole. */
function splitLines(el: HTMLElement) {
  const original = el.innerHTML;
  const words: HTMLElement[] = [];
  const frag = document.createDocumentFragment();

  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const w = document.createElement('span');
          w.style.display = 'inline-block';
          w.textContent = part;
          words.push(w);
          frag.appendChild(w);
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(true) as HTMLElement;
      if ((clone as HTMLElement).tagName === 'BR') {
        frag.appendChild(clone);
        return;
      }
      const w = document.createElement('span');
      w.style.display = 'inline-block';
      w.appendChild(clone);
      words.push(w);
      frag.appendChild(w);
    }
  });

  el.innerHTML = '';
  el.appendChild(frag);

  // Group words into lines by their vertical position.
  const lines: HTMLElement[][] = [];
  let lastTop: number | null = null;
  words.forEach((w) => {
    const top = w.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 4) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1].push(w);
  });

  el.innerHTML = '';
  const inners: HTMLElement[] = [];
  lines.forEach((lineWords) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    lineWords.forEach((w, i) => {
      inner.appendChild(w);
      if (i < lineWords.length - 1) inner.appendChild(document.createTextNode(' '));
    });
    line.appendChild(inner);
    el.appendChild(line);
    inners.push(inner);
  });

  return { inners, revert: () => (el.innerHTML = original) };
}

function initSplits() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const { inners, revert } = splitLines(el);
    el.classList.add('is-split');
    gsap.set(inners, { yPercent: 115, rotate: 2.5, transformOrigin: '0% 0%' });
    const delay = Number(el.dataset.delay ?? 0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(inners, {
          yPercent: 0,
          rotate: 0,
          duration: 1.25,
          stagger: 0.085,
          delay,
          ease: 'expo.out',
          // Restore the original markup so text reflows naturally on resize.
          onComplete: revert,
        }),
    });
  });
}

function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const kind = el.dataset.reveal || 'up';
    const from: gsap.TweenVars = { opacity: 0 };
    if (kind === 'up') from.y = 48;
    if (kind === 'left') from.x = -48;
    if (kind === 'scale') from.scale = 0.94;
    gsap.set(el, { ...from });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.2,
          delay: Number(el.dataset.delay ?? 0),
          clearProps: 'transform',
        }),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    const kids = Array.from(el.children) as HTMLElement[];
    gsap.set(kids, { opacity: 0, y: 36 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(kids, { opacity: 1, y: 0, stagger: 0.09, duration: 1.1, clearProps: 'transform' }),
    });
  });
}

function initPens(reduce: boolean) {
  document.querySelectorAll<HTMLElement>('[data-pen] path').forEach((path) => {
    const p = path as unknown as SVGPathElement;
    const len = p.getTotalLength();
    if (reduce) return;
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    ScrollTrigger.create({
      trigger: p.closest('[data-pen]'),
      start: 'top 80%',
      once: true,
      onEnter: () => gsap.to(p, { strokeDashoffset: 0, duration: 1.4, delay: 0.5, ease: 'power2.inOut' }),
    });
  });
}

function initRules() {
  document.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: '0% 50%' },
      {
        scaleX: 1,
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    );
  });
}

function initParallax() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 700px)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = Number(el.dataset.parallax || 0.15);
      gsap.fromTo(
        el,
        { y: () => window.innerHeight * speed },
        {
          y: () => -window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  });
}

let booted = false;

export function initMotion() {
  if (booted) return;
  booted = true;
  window.__arMotion = true;

  const reduce = reducedMotion();
  if (reduce) {
    document.documentElement.classList.add('reduce-motion');
    initPens(true);
    document.querySelectorAll('[data-split]').forEach((el) => el.classList.add('is-split'));
    return;
  }

  // Line splitting needs final font metrics; don't wait forever for them.
  const fontsReady = Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 900)),
  ]);
  fontsReady.then(() => {
    initSplits();
    ScrollTrigger.refresh();
  });
  initReveals();
  initPens(false);
  initRules();
  initParallax();

  // Fonts change line heights and widths: re-measure once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

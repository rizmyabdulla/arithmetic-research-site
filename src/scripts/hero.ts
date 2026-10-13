/**
 * Hero: particle equation + first-scroll transition.
 *
 * Performance notes
 * - Canvas 2D, one fillRect per particle, DPR capped at 2.
 * - Particle count scales with viewport area (≈1k on phones, ≤2.8k on desktop).
 * - The loop stops when the hero is off-screen, the tab is hidden, or the
 *   particles have handed over to the solid DOM bars.
 * - All scroll work is transforms/opacity on a handful of elements.
 */
import { gsap, ScrollTrigger, reducedMotion } from './motion';

interface Particle {
  hx: number; // home (assembled) position
  hy: number;
  sx: number; // scattered offset
  sy: number;
  ph: number; // phase
  fr: number; // frequency
  dx: number; // pointer displacement (smoothed)
  dy: number;
  red: boolean;
  size: number;
}

interface Glyph {
  ch: string;
  x: number;
  y: number;
  z: number; // depth 0..1, drives parallax + alpha
  r: number;
}

const GLYPHS = ['+', '−', '×', '÷', '=', '0', '1', '2', '3', '5', '8', '∑', '√', 'π', 'x', 'n'];

export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const stage = hero?.querySelector<HTMLElement>('[data-hero-stage]');
  const canvas = hero?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const ctx = canvas?.getContext('2d');
  if (!hero || !stage || !canvas || !ctx) return;

  const eq = {
    wrap: hero.querySelector<HTMLElement>('[data-hero-eq]')!,
    carry: hero.querySelector<HTMLElement>('[data-eq="carry"]')!,
    top: hero.querySelector<HTMLElement>('[data-eq="top"]')!,
    bot: hero.querySelector<HTMLElement>('[data-eq="bot"]')!,
  };
  const words = hero.querySelectorAll<HTMLElement>('[data-hero-word]');
  const fades = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');
  const coords = hero.querySelector<HTMLElement>('[data-hero-coords]');

  const reduce = reducedMotion();

  /* ---------------------------------------------------------------- state */
  let W = 0;
  let H = 0;
  let dpr = 1;
  let particles: Particle[] = [];
  let glyphs: Glyph[] = [];
  const pointer = { x: -9999, y: -9999, nx: 0.5, ny: 0.5, tx: 0.5, ty: 0.5, active: false };
  /**
   * spread: 1 = fully scattered, 0 = assembled (owned by the intro).
   * settle: 0 → 1 removes what is left of the scatter (owned by scroll).
   * scroll: 0 → 1 calms the idle wobble and drives glyph parallax (owned by scroll).
   */
  const field = { spread: 1, settle: 0, scroll: 0, alpha: 1 };
  let running = false;
  let visible = true;
  let raf = 0;
  let t0 = performance.now();

  /* ------------------------------------------------------------- geometry */
  function rectOf(el: HTMLElement) {
    const s = stage!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    // getBoundingClientRect includes transforms; the bars are untransformed at build time.
    return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
  }

  function build() {
    const rect = stage!.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Measure the bars with any scroll transforms cleared.
    const saved = [eq.carry, eq.top, eq.bot].map((el) => el.style.transform);
    [eq.carry, eq.top, eq.bot].forEach((el) => (el.style.transform = 'none'));
    const parts = [
      { r: rectOf(eq.carry), red: true },
      { r: rectOf(eq.top), red: false },
      { r: rectOf(eq.bot), red: false },
    ];
    [eq.carry, eq.top, eq.bot].forEach((el, i) => (el.style.transform = saved[i]));

    const totalArea = parts.reduce((a, p) => a + p.r.w * p.r.h, 0);
    const budget = Math.round(Math.min(2800, Math.max(900, (W * H) / 520)));
    const step = Math.sqrt(totalArea / budget);
    const small = W < 700;

    particles = [];
    for (const { r, red } of parts) {
      for (let y = r.y + step / 2; y < r.y + r.h; y += step) {
        for (let x = r.x + step / 2; x < r.x + r.w; x += step) {
          const a = Math.random() * Math.PI * 2;
          const d = (0.35 + Math.random() * 0.65) * Math.max(W, H) * 0.55;
          particles.push({
            hx: x + (Math.random() - 0.5) * step * 0.6,
            hy: y + (Math.random() - 0.5) * step * 0.6,
            sx: Math.cos(a) * d,
            sy: Math.sin(a) * d,
            ph: Math.random() * Math.PI * 2,
            fr: 0.4 + Math.random() * 0.9,
            dx: 0,
            dy: 0,
            red,
            size: small ? 1.6 : step > 7 ? 2.2 : 1.8,
          });
        }
      }
    }

    // Background layer of operator glyphs at different depths.
    const count = small ? 18 : 42;
    glyphs = Array.from({ length: count }, () => ({
      ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      r: (Math.random() - 0.5) * 0.4,
    }));
  }

  /* ----------------------------------------------------------------- draw */
  function frame(now: number) {
    const t = (now - t0) / 1000;
    ctx!.clearRect(0, 0, W, H);

    // Smooth pointer for parallax
    pointer.nx += (pointer.tx - pointer.nx) * 0.06;
    pointer.ny += (pointer.ty - pointer.ny) * 0.06;
    const px = pointer.nx - 0.5;
    const py = pointer.ny - 0.5;

    const fieldAlpha = field.alpha;
    if (fieldAlpha <= 0.001) return;

    // Depth layer: glyphs drift and parallax against the pointer.
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    for (const g of glyphs) {
      const depth = 0.2 + g.z * 0.8;
      const size = 10 + g.z * 26;
      const gx = g.x - px * 60 * depth;
      const gy = ((g.y - t * (6 + g.z * 10) - field.scroll * 260 * depth) % (H + 60) + H + 60) % (H + 60) - 30;
      ctx!.globalAlpha = (0.05 + g.z * 0.14) * fieldAlpha;
      ctx!.fillStyle = '#ecebe5';
      ctx!.font = `${Math.round(size)}px "JetBrains Mono Variable", ui-monospace, monospace`;
      ctx!.save();
      ctx!.translate(gx, gy);
      ctx!.rotate(g.r);
      ctx!.fillText(g.ch, 0, 0);
      ctx!.restore();
    }

    // Equation particles
    const spread = field.spread * (1 - field.settle);
    const wobble = (1 - field.scroll) * (2.2 + spread * 10);
    const rad = 120;
    const rad2 = rad * rad;
    const ox = -px * 18;
    const oy = -py * 12;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const e = spread * spread; // ease the spread for a softer landing
      let x = p.hx + p.sx * e + Math.sin(t * p.fr + p.ph) * wobble + ox;
      let y = p.hy + p.sy * e + Math.cos(t * p.fr * 0.8 + p.ph) * wobble + oy;

      // Pointer repulsion with smoothing
      let tx = 0;
      let ty = 0;
      if (pointer.active) {
        const ddx = x - pointer.x;
        const ddy = y - pointer.y;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < rad2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / rad) ** 2 * 46;
          tx = (ddx / d) * f;
          ty = (ddy / d) * f;
        }
      }
      p.dx += (tx - p.dx) * 0.12;
      p.dy += (ty - p.dy) * 0.12;
      x += p.dx;
      y += p.dy;

      ctx!.globalAlpha = (p.red ? 1 : 0.88) * fieldAlpha;
      ctx!.fillStyle = p.red ? '#ff4d1a' : '#ecebe5';
      ctx!.fillRect(x, y, p.size, p.size);
    }
    ctx!.globalAlpha = 1;

    if (coords && pointer.active) {
      coords.textContent = `x ${pointer.nx.toFixed(3)} · y ${pointer.ny.toFixed(3)}`;
    }
  }

  function loop(now: number) {
    frame(now);
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (running || reduce) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  function sync() {
    if (visible && !document.hidden && field.alpha > 0.001) start();
    else stop();
  }

  /* --------------------------------------------------------------- input */
  stage.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.tx = pointer.x / r.width;
      pointer.ty = pointer.y / r.height;
      pointer.active = true;
    },
    { passive: true },
  );
  stage.addEventListener('pointerleave', () => {
    pointer.active = false;
    pointer.x = pointer.y = -9999;
    pointer.tx = pointer.ty = 0.5;
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(stage);
  document.addEventListener('visibilitychange', sync);

  build();

  /* ------------------------------------------------- reduced motion: static */
  if (reduce) {
    field.spread = 0;
    field.scroll = 1; // no wobble
    field.alpha = 0; // the solid DOM glyph is shown instead
    words.forEach((w) => (w.style.opacity = '1'));
    fades.forEach((f) => (f.style.opacity = '1'));
    return;
  }

  /* ---------------------------------------------------------------- intro */
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .fromTo(field, { spread: 1 }, { spread: 0.08, duration: 2.6, ease: 'expo.inOut' }, 0)
    .fromTo(
      words,
      { yPercent: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      { yPercent: 0, opacity: 1, clipPath: 'inset(0 0 -10% 0)', duration: 1.6, stagger: 0.18 },
      0.7,
    )
    .fromTo(fades, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 1.5);

  start();

  /* ------------------------------------------------------- scroll choreography */
  const vw = () => window.innerWidth;
  const vh = () => stage.getBoundingClientRect().height;

  // Each bar grows (transform only) until the two bars tile the viewport.
  const untransformed = (el: HTMLElement) => {
    const prev = el.style.transform;
    el.style.transform = 'none';
    const r = el.getBoundingClientRect();
    el.style.transform = prev;
    return r;
  };
  const coverFor = (el: HTMLElement, half: 'top' | 'bot') => {
    const r = untransformed(el);
    const split = (untransformed(eq.top).bottom + untransformed(eq.bot).top) / 2; // seam between the bars
    const targetTop = half === 'top' ? -2 : split - 1;
    const targetBot = half === 'top' ? split + 1 : vh() + 2;
    return {
      x: vw() / 2 - (r.left + r.width / 2),
      y: (targetTop + targetBot) / 2 - (r.top + r.height / 2),
      scaleX: (vw() + 4) / r.width,
      scaleY: (targetBot - targetTop) / r.height,
    };
  };
  const cover = (el: HTMLElement, half: 'top' | 'bot') => ({
    x: () => coverFor(el, half).x,
    y: () => coverFor(el, half).y,
    scaleX: () => coverFor(el, half).scaleX,
    scaleY: () => coverFor(el, half).scaleY,
  });

  let handedOver = false;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${Math.round(vh() * (vw() < 820 ? 0.95 : 1.25))}`,
      pin: stage,
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        // The page turns to paper once the bars have mostly closed.
        const covered = self.progress > 0.78;
        hero.dataset.tone = covered ? 'light' : 'dark';
        const env = covered ? 'paper' : 'ink';
        if (hero.dataset.env !== env) {
          hero.dataset.env = env;
          hero.dispatchEvent(new CustomEvent('envchange', { bubbles: true }));
        }
        // Hand over from particles to solid bars, and back.
        const over = self.progress > 0.32;
        if (over !== handedOver) {
          handedOver = over;
          sync();
        }
      },
    },
  });

  tl.to(field, { settle: 1, scroll: 1, duration: 0.3, ease: 'power2.out' }, 0)
    // Explicit start values: the intro may still be running when scrolling starts.
    .fromTo(words[0], { xPercent: 0, yPercent: 0, opacity: 1 }, { xPercent: -18, yPercent: -30, opacity: 0, duration: 0.3, immediateRender: false }, 0)
    .fromTo(words[1], { xPercent: 0, yPercent: 0, opacity: 1 }, { xPercent: 18, yPercent: 30, opacity: 0, duration: 0.3, immediateRender: false }, 0)
    .fromTo(fades, { opacity: 1, y: 0 }, { opacity: 0, duration: 0.15, immediateRender: false }, 0)
    .to([eq.carry, eq.top, eq.bot], { opacity: 1, duration: 0.08 }, 0.22)
    .to(field, { alpha: 0, duration: 0.08, onUpdate: sync, onReverseComplete: sync }, 0.26)
    .to(eq.carry, { scale: 0, rotate: 90, duration: 0.2, ease: 'power2.in' }, 0.32)
    .to(eq.top, { ...cover(eq.top, 'top'), duration: 0.55, ease: 'power3.inOut' }, 0.38)
    .to(eq.bot, { ...cover(eq.bot, 'bot'), duration: 0.55, ease: 'power3.inOut' }, 0.38)
    .to(eq.top, { backgroundColor: '#ecebe5', duration: 0.01 }, 0.93);

  // Particle homes follow the bars' layout; rebuild after every refresh (resize, fonts).
  ScrollTrigger.addEventListener('refresh', build);
}

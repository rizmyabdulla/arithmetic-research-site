/**
 * Environment changes for long-form pages.
 *
 * Wrap sections in `[data-story]`. Each section declares an environment:
 *   data-env="ink" | "paper"   — company presets
 *   data-env="custom" with inline --e-bg / --e-fg / --e-muted / --e-accent / --e-rule
 * As a section crosses the middle of the viewport, the wrapper's color
 * variables (registered with @property, so they interpolate) move to it.
 * Without JS — or before this runs — each section paints its own background.
 */
import { ScrollTrigger, reducedMotion } from './motion';

const presets: Record<string, Record<string, string>> = {
  ink: { bg: '#0c0c0a', fg: '#ecebe5', muted: '#a19f96', accent: '#ff4d1a', rule: 'rgb(236 235 229 / 0.09)' },
  paper: { bg: '#ecebe5', fg: '#0c0c0a', muted: '#5c5a53', accent: '#ff4d1a', rule: 'rgb(12 12 10 / 0.09)' },
};

export function initStory() {
  // With reduced motion every section simply keeps its own colors.
  if (reducedMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-story]').forEach((story) => {
    const sections = Array.from(story.querySelectorAll<HTMLElement>(':scope > [data-env]'));
    if (!sections.length) return;

    const envOf = (el: HTMLElement) => {
      const preset = presets[el.dataset.env ?? ''];
      if (preset) return preset;
      const cs = getComputedStyle(el);
      const read = (k: string) => cs.getPropertyValue(`--e-${k}`).trim() || presets.paper[k];
      return { bg: read('bg'), fg: read('fg'), muted: read('muted'), accent: read('accent'), rule: read('rule') };
    };

    const apply = (el: HTMLElement) => {
      const env = envOf(el);
      for (const [k, v] of Object.entries(env)) story.style.setProperty(`--s-${k}`, v);
      story.dataset.active = el.id || el.dataset.env || '';
    };

    let current: HTMLElement | null = null;
    const update = (force = false) => {
      // The section under the 55% line owns the environment. Above or below the
      // story, the nearest end section does.
      const line = window.innerHeight * 0.55;
      let next = sections[0];
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) next = el;
        else break;
      }
      if (force || next !== current) {
        current = next;
        apply(next);
      }
    };

    update(true);
    story.classList.add('is-live');

    ScrollTrigger.create({
      trigger: story,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: () => update(),
      onRefresh: () => update(),
    });
    // A section can change its own environment mid-scroll (the hero does).
    story.addEventListener('envchange', (e) => {
      if (e.target === current) update(true);
    });
  });
}

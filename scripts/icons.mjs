// Rasterises public/favicon.svg into the PNG icons referenced by the site.
// Run with: node scripts/icons.mjs   (needs the `sharp` dev dependency)
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname;

for (const [name, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(svg, { density: 72 * (size / 32) }).resize(size, size).png().toFile(out(name));
  console.log('wrote', name);
}

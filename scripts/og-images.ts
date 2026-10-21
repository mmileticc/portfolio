/**
 * Renders the 1200×630 share images in public/og/ (one per project plus a default).
 * Run after changing a project's name, tagline or colour: `npm run og`.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { PROJECTS } from '../src/app/content/projects.ts';
import { SITE } from '../src/app/site.config.ts';

const OUT = join(import.meta.dirname, '..', 'public', 'og');
// CSS variables do not exist in an SVG rendered on its own, so mirror the pedal colours here.
const COLORS: Record<string, string> = {
  'var(--pedal-red)': '#e0453a',
  'var(--pedal-orange)': '#f08a24',
  'var(--pedal-green)': '#2f9e5f',
  'var(--pedal-blue)': '#3a72d0',
};

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word wrap, good enough for a headline. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function pedal(
  x: number,
  y: number,
  color: string,
  ink: string,
  name: string,
  model: string,
): string {
  return `
  <g transform="translate(${x} ${y}) rotate(-4 150 210)">
    <rect x="0" y="16" width="300" height="420" rx="26" fill="#000" opacity="0.35"/>
    <rect x="0" y="0" width="300" height="420" rx="26" fill="${color}"/>
    <rect x="0" y="0" width="300" height="420" rx="26" fill="url(#shine)"/>
    ${[70, 150, 230].map((cx) => `<circle cx="${cx}" cy="70" r="26" fill="#1b1916"/><rect x="${cx - 2}" y="48" width="4" height="18" rx="2" fill="#f4ecdf" transform="rotate(${cx - 120} ${cx} 70)"/>`).join('')}
    <rect x="30" y="122" width="240" height="150" rx="14" fill="#fff" opacity="0.16"/>
    <circle cx="150" cy="148" r="8" fill="#ff3b2f"/>
    <text x="150" y="196" text-anchor="middle" font-family="Consolas, monospace" font-size="15" font-weight="700" letter-spacing="2" fill="${ink}" opacity="0.8">${escape(model.toUpperCase())}</text>
    <text x="150" y="240" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="${name.length > 10 ? 26 : 36}" font-weight="900" fill="${ink}">${escape(name)}</text>
    <circle cx="150" cy="350" r="42" fill="#c9c3b8" stroke="#3f3a34" stroke-width="6"/>
  </g>`;
}

function card(opts: {
  title: string;
  subtitle: string;
  eyebrow: string;
  color: string;
  ink: string;
  model: string;
  /** Name printed on the pedal; defaults to the last word of a long title. */
  pedalName?: string;
}): string {
  const lines = wrap(opts.subtitle, 34).slice(0, 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.3"/>
      <stop offset="0.45" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#f4ecdf" opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#16130f"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect x="0" y="0" width="1200" height="14" fill="${opts.color}"/>
  <text x="80" y="130" font-family="Consolas, monospace" font-size="24" letter-spacing="4" fill="#968b7a">${escape(opts.eyebrow.toUpperCase())}</text>
  <text x="80" y="230" font-family="Arial Black, Arial, sans-serif" font-size="${opts.title.length > 14 ? 62 : 92}" font-weight="900" fill="#f4ecdf">${escape(opts.title)}</text>
  ${lines.map((l, i) => `<text x="80" y="${310 + i * 50}" font-family="Arial, sans-serif" font-size="38" fill="#c9bfae">${escape(l)}</text>`).join('')}
  <text x="80" y="570" font-family="Consolas, monospace" font-size="24" fill="#ff7a45">${escape(SITE.url.replace('https://', ''))}</text>
  ${pedal(820, 100, opts.color, opts.ink, opts.pedalName ?? (opts.title.length > 12 ? opts.title.split(' ').at(-1)! : opts.title), opts.model)}
</svg>`;
}

mkdirSync(OUT, { recursive: true });

const jobs = [
  {
    file: 'default.png',
    svg: card({
      title: SITE.name,
      subtitle: 'Software engineer from Belgrade. Android, Kotlin backends and the web.',
      eyebrow: 'Portfolio',
      color: COLORS['var(--pedal-red)'],
      ink: '#1a0806',
      model: 'Signal chain',
      pedalName: SITE.shortName,
    }),
  },
  ...PROJECTS.map((p) => ({
    file: `${p.slug}.png`,
    svg: card({
      title: p.name,
      subtitle: p.tagline,
      eyebrow: `Project · ${SITE.name}`,
      color: COLORS[p.color] ?? '#e0453a',
      ink: p.ink,
      model: p.model,
    }),
  })),
];

for (const job of jobs) {
  await sharp(Buffer.from(job.svg)).png({ compressionLevel: 9 }).toFile(join(OUT, job.file));
  console.log(`✔ public/og/${job.file}`);
}

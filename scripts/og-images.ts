/**
 * Renders the 1200×630 share images in public/og/ (one per project plus a default):
 * a spruce guitar top with its soundhole, and the page title on a sheet of music paper.
 * Run after changing a project's name, tagline or colour: `npm run og`.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { PROJECTS } from '../src/app/content/projects.ts';
import { SITE } from '../src/app/site.config.ts';

const OUT = join(import.meta.dirname, '..', 'public', 'og');
// CSS variables do not exist in an SVG rendered on its own, so mirror the song colours here.
const COLORS: Record<string, string> = {
  'var(--song-red)': '#b8452f',
  'var(--song-amber)': '#c27a1e',
  'var(--song-green)': '#3f7d4f',
  'var(--song-blue)': '#36649c',
  'var(--song-plum)': '#7a4b7a',
  'var(--song-teal)': '#2f7c7c',
  'var(--song-slate)': '#5a6472',
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

/** The guitar top with rosette and strings, centred at (cx, cy). */
function soundhole(cx: number, cy: number): string {
  const strings = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const x = cx - 75 + i * 30;
      const w = [4.4, 3.8, 3.2, 2.4, 1.9, 1.5][i];
      return `<line x1="${x}" x2="${x}" y1="0" y2="630" stroke="${i < 3 ? '#b89f6a' : '#d6c7a3'}" stroke-width="${w}"/>`;
    })
    .join('');
  return `
    <circle cx="${cx}" cy="${cy}" r="205" fill="none" stroke="#4a2618" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="196" fill="none" stroke="#7a3b1f" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="182" fill="none" stroke="#4a2618" stroke-width="20"/>
    <circle cx="${cx}" cy="${cy}" r="182" fill="none" stroke="#e8d6a8" stroke-width="20" stroke-dasharray="6 9"/>
    <circle cx="${cx}" cy="${cy}" r="168" fill="none" stroke="#7a3b1f" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="#4a2618" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="148" fill="#0c0705"/>
    ${strings}`;
}

function card(opts: { title: string; subtitle: string; eyebrow: string; color: string }): string {
  const lines = wrap(opts.subtitle, 30).slice(0, 4);
  const grain = Array.from(
    { length: 42 },
    (_, i) =>
      `<line x1="0" x2="1200" y1="${i * 15 + (i % 3) * 4}" y2="${i * 15 + 8}" stroke="#c99a5b" stroke-opacity="0.3"/>`,
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#e9cf9c"/>
  ${grain}
  ${soundhole(930, 315)}
  <g transform="rotate(-1.5 360 315)">
    <rect x="58" y="78" width="600" height="474" rx="8" fill="#5a3a1a" opacity="0.25"/>
    <rect x="50" y="64" width="600" height="474" rx="8" fill="#fffaf0"/>
    <rect x="50" y="64" width="14" height="474" fill="${opts.color}"/>
    <text x="100" y="132" font-family="Consolas, monospace" font-size="20" letter-spacing="4" fill="#7c6650">${escape(opts.eyebrow.toUpperCase())}</text>
    <text x="100" y="222" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${opts.title.length > 14 ? 52 : 76}" fill="#2b1d14">${escape(opts.title)}</text>
    ${lines.map((l, i) => `<text x="100" y="${292 + i * 46}" font-family="Georgia, serif" font-style="italic" font-size="34" fill="#55402f">${escape(l)}</text>`).join('')}
    ${[0, 1, 2, 3, 4].map((i) => `<line x1="100" x2="610" y1="${470 + i * 9}" y2="${470 + i * 9}" stroke="#2b1d14" stroke-opacity="0.25"/>`).join('')}
    <text x="100" y="528" font-family="Consolas, monospace" font-size="20" fill="#a8461f">${escape(SITE.url.replace('https://', ''))}</text>
  </g>
</svg>`;
}

mkdirSync(OUT, { recursive: true });

const jobs = [
  {
    file: 'default.png',
    svg: card({
      title: SITE.name,
      subtitle: 'Software engineer from Belgrade. Android, Kotlin backends and the web.',
      eyebrow: 'Portfolio · the songbook',
      color: COLORS['var(--song-red)'],
    }),
  },
  ...PROJECTS.map((p) => ({
    file: `${p.slug}.png`,
    svg: card({
      title: p.name,
      subtitle: p.tagline,
      eyebrow: p.style,
      color: COLORS[p.color] ?? COLORS['var(--song-red)'],
    }),
  })),
];

for (const job of jobs) {
  await sharp(Buffer.from(job.svg)).png({ compressionLevel: 9 }).toFile(join(OUT, job.file));
  console.log(`✔ public/og/${job.file}`);
}

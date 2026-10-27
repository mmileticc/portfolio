/**
 * Prepares the prerendered output for GitHub Pages:
 *   - preloads the two fonts the first screen is set in, in every page
 *   - 404.html from the prerendered /404 route, served for unknown URLs
 *   - .nojekyll so files starting with "_" are served as-is
 */
import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist', 'portfolio', 'browser');
const notFound = join(DIST, '404', 'index.html');

if (!existsSync(notFound)) {
  console.error(
    '✖ dist/portfolio/browser/404/index.html is missing. Is the /404 route prerendered?',
  );
  process.exit(1);
}

/* ───────── Font preloads ───────── */

// Body text and headings; the hashed names change with every font update, so look them up.
const CRITICAL_FONTS = [
  /^inter-latin-wght-normal-.*\.woff2$/,
  /^fraunces-latin-wght-normal-.*\.woff2$/,
];
const media = readdirSync(join(DIST, 'media'));
const preloads = CRITICAL_FONTS.map((pattern) => {
  const file = media.find((f) => pattern.test(f));
  if (!file) throw new Error(`No font in dist/media matches ${pattern}`);
  return `<link rel="preload" href="media/${file}" as="font" type="font/woff2" crossorigin>`;
}).join('');

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

let pages = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  if (html.includes('rel="preload" href="media/')) continue;
  // Right after <base href>, so the relative font URLs resolve under /portfolio/.
  const updated = html.replace(/(<base href="[^"]*">)/, `$1${preloads}`);
  if (updated !== html) {
    writeFileSync(file, updated);
    pages++;
  }
}
console.log(`✔ font preloads in ${pages} page(s)`);

/* ───────── GitHub Pages ───────── */

copyFileSync(notFound, join(DIST, '404.html'));
writeFileSync(join(DIST, '.nojekyll'), '');
console.log('✔ 404.html and .nojekyll written');

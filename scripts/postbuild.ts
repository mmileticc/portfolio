/**
 * Prepares the prerendered output for GitHub Pages:
 *   - 404.html from the prerendered /404 route, served for unknown URLs
 *   - .nojekyll so files starting with "_" are served as-is
 */
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist', 'portfolio', 'browser');
const notFound = join(DIST, '404', 'index.html');

if (!existsSync(notFound)) {
  console.error(
    '✖ dist/portfolio/browser/404/index.html is missing. Is the /404 route prerendered?',
  );
  process.exit(1);
}

copyFileSync(notFound, join(DIST, '404.html'));
writeFileSync(join(DIST, '.nojekyll'), '');
console.log('✔ 404.html and .nojekyll written');

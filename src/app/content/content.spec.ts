import { formatDate, timeAgo } from '../core/format';
import { toCommit } from './github-api';
import { DEMOS, FEATURED, HIDDEN_REPOS, PROJECTS, findProject } from './projects';

describe('projects', () => {
  it('have unique, URL-safe slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('have everything a case study page shows', () => {
    for (const p of PROJECTS) {
      expect(p.chords).toHaveLength(3);
      expect(p.flow.length).toBeGreaterThanOrEqual(2);
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.links.some((l) => l.kind === 'repo')).toBe(true);
      for (const img of p.images) expect(img.alt.length).toBeGreaterThan(0);
    }
  });

  it('keep song repositories out of the B-sides', () => {
    expect(HIDDEN_REPOS.has('movienee-web')).toBe(true);
    expect(HIDDEN_REPOS.has('GotH')).toBe(true);
    expect(HIDDEN_REPOS.has('Code-Grill')).toBe(true);
    expect(HIDDEN_REPOS.has('OS1-project')).toBe(false);
  });

  it('split into four featured songs and the demos', () => {
    expect(FEATURED.map((p) => p.slug)).toEqual([
      'movienee',
      'movienee-scrapers',
      'fuelscan',
      'goth',
    ]);
    expect(DEMOS.length + FEATURED.length).toBe(PROJECTS.length);
  });

  it('are found by slug', () => {
    expect(findProject('goth')?.name).toBe('GotH');
    expect(findProject('nope')).toBeUndefined();
    expect(findProject(undefined)).toBeUndefined();
  });
});

describe('toCommit', () => {
  it('keeps the first line and shortens long messages', () => {
    const long = 'x'.repeat(120);
    const c = toCommit('repo', {
      html_url: 'u',
      commit: {
        message: `${long}\n\nbody`,
        author: null,
        committer: { date: '2026-01-01T00:00:00Z' },
      },
    });
    expect(c.message).toHaveLength(90);
    expect(c.message.endsWith('...')).toBe(true);
    expect(c.date).toBe('2026-01-01T00:00:00Z');
  });
});

describe('format', () => {
  const now = Date.parse('2026-10-21T12:00:00Z');

  it('describes relative time', () => {
    expect(timeAgo('2026-10-21T11:59:30Z', now)).toBe('just now');
    expect(timeAgo('2026-10-21T09:00:00Z', now)).toBe('3 hours ago');
    expect(timeAgo('2026-10-20T12:00:00Z', now)).toBe('yesterday');
    expect(timeAgo('not a date', now)).toBe('');
  });

  it('formats a post date', () => {
    expect(formatDate('2026-10-21')).toBe('October 21, 2026');
  });
});

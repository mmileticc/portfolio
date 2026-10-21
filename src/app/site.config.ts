/**
 * Personal details used across the site. Empty strings hide the matching link or feature.
 */
export const SITE = {
  name: 'Milinko Miletić',
  shortName: 'Milinko',
  githubUser: 'mmileticc',
  url: 'https://mmileticc.github.io/portfolio',
  location: 'Belgrade, Serbia',
  description:
    'Milinko Miletić: software engineer from Belgrade building full products across Android, Kotlin backends and the web. Also plays guitar and harmonica.',
  // TODO: fill in before going live.
  email: '',
  linkedin: '',
  formspreeId: '',
} as const;

export const GITHUB_URL = `https://github.com/${SITE.githubUser}`;

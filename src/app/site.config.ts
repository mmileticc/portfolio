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
  /**
   * Kept in two parts so the full address never appears in the source or the prerendered HTML;
   * EmailLink joins them in the browser. Leave `user` empty to hide email links.
   */
  email: { user: 'milinko.miletic.dev', domain: 'gmail.com' },
  linkedin: 'https://www.linkedin.com/in/milinko-miletic/',
  /** Form ID from the Formspree endpoint https://formspree.io/f/<id>. */
  formspreeId: 'xwlvgawl',
} as const;

export const GITHUB_URL = `https://github.com/${SITE.githubUser}`;

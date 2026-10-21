export interface ProjectLink {
  label: string;
  url: string;
  kind: 'live' | 'repo' | 'docs';
}

export interface ProjectImage {
  src: string;
  alt: string;
  /** Phone screenshots are shown narrower than desktop ones. */
  phone?: boolean;
}

export interface Project {
  slug: string;
  name: string;
  /** The "pedal model" printed on the enclosure. */
  model: string;
  /** CSS colour of the enclosure. */
  color: string;
  /** Text colour that reads well on `color`. */
  ink: string;
  tagline: string;
  summary: string;
  problem: string[];
  /** Three knob labels shown on the pedal. */
  knobs: [string, string, string];
  /** The architecture as a signal chain, from input to output. */
  flow: { label: string; detail: string }[];
  features: { title: string; text: string }[];
  stack: { group: string; items: string[] }[];
  links: ProjectLink[];
  /** GitHub repositories that belong to this project (kept out of the gig bag). */
  repos: string[];
  images: ProjectImage[];
}

const GH = 'https://github.com/mmileticc';

export const PROJECTS: Project[] = [
  {
    slug: 'movienee',
    name: 'Movienee',
    model: 'Cinema Overdrive',
    color: 'var(--pedal-red)',
    ink: '#1a0806',
    tagline: 'Find a movie, see where it plays in Serbia, and plan a movie night with friends.',
    summary:
      'A movie discovery and social app with a native Android client, an Angular web app and a Kotlin/Ktor backend. One account, library and friend list are shared across all of them.',
    problem: [
      'There is no single place that tells you what is actually playing in Serbian cinemas, where, and when. Every chain has its own website, and none of them knows your taste or your friends.',
      'Movienee puts it together: the catalogue and ratings from TMDB, IMDb and Rotten Tomatoes, the real showtimes of seven cinema chains sorted by distance, and a social layer for watchlists, ratings, comments and joint "Movie Night" suggestions. You can also find a movie from a photo of a poster or by describing the mood you are in.',
    ],
    knobs: ['Android', 'Ktor', 'Angular'],
    flow: [
      { label: 'Cinema sites', detail: '7 chains scraped in parallel' },
      { label: 'Ktor backend', detail: 'Postgres, JWT, TTL caches, Gemini' },
      { label: 'Android app', detail: 'Compose, Room offline cache' },
      { label: 'Web app', detail: 'Angular PWA on Firebase Hosting' },
    ],
    features: [
      {
        title: 'Now in cinemas',
        text: 'Every showtime of the next seven days with a link to buy that exact screening, sorted by distance from you.',
      },
      {
        title: 'AI search',
        text: 'Photograph a poster or a film still, or describe a mood: Gemini vision and embeddings turn it into a concrete movie.',
      },
      {
        title: 'Friends and Movie Night',
        text: 'Friend requests, taste match, "friends who watched this" and suggestions for two people to watch together.',
      },
      {
        title: 'Offline-first Android',
        text: 'Watchlist, history and profile render instantly from a Room cache while the network refreshes in the background.',
      },
      {
        title: 'Resilient backend',
        text: 'Timeouts, retries and graceful degradation around every upstream, so one slow API never takes down an unrelated feature.',
      },
      {
        title: 'Installable web app',
        text: 'Serbian and English, dark and light, from 375 px phones to desktop, Lighthouse accessibility 100.',
      },
    ],
    stack: [
      {
        group: 'Android',
        items: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Room', 'Navigation-Compose'],
      },
      {
        group: 'Backend',
        items: ['Ktor', 'Exposed', 'PostgreSQL', 'JWT', 'Coroutines', 'Gemini API'],
      },
      { group: 'Web', items: ['Angular 22', 'Signals', 'Transloco', 'PWA', 'Vitest'] },
      {
        group: 'Platform',
        items: ['Firebase Auth', 'Firebase Hosting', 'GitHub Actions', 'TMDB / OMDb'],
      },
    ],
    links: [
      { label: 'Open the web app', url: 'https://movienee.web.app', kind: 'live' },
      { label: 'Android', url: `${GH}/MovieLensAndroid`, kind: 'repo' },
      { label: 'Backend', url: `${GH}/MovieLensBackendKtor`, kind: 'repo' },
      { label: 'Web', url: `${GH}/movienee-web`, kind: 'repo' },
    ],
    repos: ['MovieLensAndroid', 'MovieLensBackendKtor', 'movienee-web'],
    images: [
      {
        src: 'images/projects/movienee/home-desktop.webp',
        alt: 'Movienee web home page with trending movies',
      },
      {
        src: 'images/projects/movienee/cinemas-desktop.webp',
        alt: 'Movies now playing in Serbian cinemas, with filters',
      },
      {
        src: 'images/projects/movienee/movie-desktop.webp',
        alt: 'Movie detail page with ratings, cast and showtimes',
      },
      {
        src: 'images/projects/movienee/movie-mobile.webp',
        alt: 'Movie detail on a phone',
        phone: true,
      },
      { src: 'images/projects/movienee/search-mobile.webp', alt: 'Search on a phone', phone: true },
    ],
  },
  {
    slug: 'movienee-scrapers',
    name: 'Movienee Scrapers',
    model: '7-Way Splitter',
    color: 'var(--pedal-orange)',
    ink: '#1f1004',
    tagline: 'Seven very different cinema websites in, one uniform data model out.',
    summary:
      'Kotlin scrapers that collect the current and upcoming programme of the major cinema chains in Serbia, including every showtime of the next seven days with a link to buy that exact screening.',
    problem: [
      'Cineplexx, CineStar, Cine Grand, MTS Dvorana, Arena, Roda and Tuckwood each publish their programme differently: server-rendered HTML, Nuxt pages with embedded JSON state, a React site backed by a private API, a WordPress theme.',
      'The scrapers read each one in the most reliable way available and produce one row per movie and location, with original titles for matching against TMDB and coordinates for sorting by distance. A real run on 15 October 2026 produced 775 rows and 3,185 showtimes at 20 locations.',
    ],
    knobs: ['Kotlin', 'Jsoup', 'Async'],
    flow: [
      { label: 'CinemaScraper', detail: 'one implementation per chain' },
      { label: 'Concurrent engine', detail: 'coroutines on Dispatchers.IO' },
      { label: 'ScrapedMovie', detail: 'title, location, showtimes, ticket links' },
      { label: 'JSON / backend', detail: 'feeds the Movienee API' },
    ],
    features: [
      {
        title: 'Structured data first',
        text: 'Where a site embeds JSON (Nuxt state, the Cineplexx API) that is read instead of the rendered HTML, so no browser is needed.',
      },
      {
        title: 'Playwright only as a fallback',
        text: 'Headless Chromium is used only if the Cineplexx API fails, and a failing page saves an HTML and PNG snapshot for debugging.',
      },
      {
        title: 'Fault isolation',
        text: 'A changed selector or a timeout never breaks the whole run. Each chain only loses its own cinema, and the summary flags it.',
      },
      {
        title: 'Seven days of showtimes',
        text: 'Hall, format (3D, 4DX, subtitles), local start time and the ticket page of exactly that screening.',
      },
      {
        title: 'Tested without a network',
        text: 'Parser tests run against recorded page fragments. API docs are generated with Dokka.',
      },
      {
        title: 'Polite by default',
        text: 'An identifiable User-Agent that links back to the repository, and a Docker image with JRE 21 and a matching Chromium.',
      },
    ],
    stack: [
      { group: 'Language', items: ['Kotlin', 'Coroutines', 'kotlinx.serialization'] },
      { group: 'Scraping', items: ['Jsoup', 'Playwright for Java', 'Nuxt payload parsing'] },
      { group: 'Tooling', items: ['Gradle', 'Docker', 'Dokka', 'kotlin.test'] },
    ],
    links: [
      {
        label: 'Project page',
        url: 'https://mmileticc.github.io/movienee-scrapers/',
        kind: 'live',
      },
      {
        label: 'API docs',
        url: 'https://mmileticc.github.io/movienee-scrapers/docs/',
        kind: 'docs',
      },
      { label: 'Repository', url: `${GH}/movienee-scrapers`, kind: 'repo' },
    ],
    repos: ['movienee-scrapers'],
    images: [
      {
        src: 'images/projects/movienee-scrapers/project-page.webp',
        alt: 'The Movienee Scrapers project page with totals per chain',
      },
    ],
  },
  {
    slug: 'fuelscan',
    name: 'FuelScan',
    model: 'Receipt Compressor',
    color: 'var(--pedal-green)',
    ink: '#04170c',
    tagline: 'Scan the QR code on a fuel receipt and get your fuel expenses tracked automatically.',
    summary:
      'An Angular app that reads the QR code from a Serbian fiscal receipt, pulls the station, litres, price and total from the Tax Administration portal and keeps a personal history with statistics. It runs without a backend server of its own.',
    problem: [
      'Every fiscal receipt in Serbia has a QR code that leads to its official copy, but the details you care about (fuel type, litres, price per litre) are behind a "Specification" button, and there is no public API.',
      'The first version used a Python/FastAPI backend that drove headless Chromium. FuelScan is now a standalone Angular app: the browser fetches and parses the receipt page itself, and a small Cloudflare Worker solves the CORS and session-cookie problem.',
    ],
    knobs: ['Angular', 'Workers', 'Supabase'],
    flow: [
      { label: 'QR scan', detail: 'camera or image, html5-qrcode' },
      { label: 'Cloudflare Worker', detail: 'CORS + session cookie relay' },
      { label: 'DOMParser', detail: 'token and invoice data in the browser' },
      { label: 'Supabase', detail: 'Google sign-in, Postgres with RLS' },
    ],
    features: [
      {
        title: 'Scan and review',
        text: 'Scan with the camera or from an image, check the extracted station, fuel, litres, price and total, then save or discard.',
      },
      {
        title: 'No server to run',
        text: 'Parsing happens in the browser. The only server-side piece is a Worker restricted to the tax portal domain.',
      },
      {
        title: 'Session-aware proxy',
        text: 'The Worker rewrites Set-Cookie so the follow-up specification request carries the same session as the original page load.',
      },
      {
        title: 'History and stats',
        text: 'A dashboard with spending and consumption charts, per user, behind Google sign-in.',
      },
      {
        title: 'Installable PWA',
        text: 'Works as an app on the phone, with a service worker for the app shell.',
      },
      {
        title: 'Deployed on every push',
        text: 'GitHub Actions builds and deploys to GitHub Pages.',
      },
    ],
    stack: [
      { group: 'Frontend', items: ['Angular 20', 'Signals', 'RxJS', 'Chart.js', 'Tailwind'] },
      { group: 'Platform', items: ['Cloudflare Workers', 'Supabase', 'GitHub Pages'] },
      { group: 'Before', items: ['Python', 'FastAPI', 'Playwright'] },
    ],
    links: [
      { label: 'Open the app', url: 'https://mmileticc.github.io/FuelScan/', kind: 'live' },
      { label: 'Repository', url: `${GH}/FuelScan`, kind: 'repo' },
    ],
    repos: ['FuelScan'],
    images: [
      {
        src: 'images/projects/fuelscan/app-desktop.webp',
        alt: 'FuelScan start screen explaining how scanning works',
      },
    ],
  },
  {
    slug: 'goth',
    name: 'GotH',
    model: 'Harmonic Transposer',
    color: 'var(--pedal-blue)',
    ink: '#050f22',
    tagline: 'Write a riff on the guitar fretboard, get the harmonica tab, and hear both.',
    summary:
      'GotH (Guitar to Harmonica) is a free browser tool for guitar players learning the diatonic harmonica: click notes on a fretboard and it writes the matching blow and draw holes, with notation and audio playback.',
    problem: [
      'Guitar tabs and harmonica tabs are two different notations. Adapting a blues or folk riff from one to the other means working out every note by hand.',
      'GotH came out of a personal need: as a guitar player learning the harmonica, I wanted to try riffs right away instead of spending hours with music theory manuals. It started as a vanilla JS page and has been rewritten in Vue 3 and TypeScript, with the mapping logic covered by unit tests.',
    ],
    knobs: ['Vue', 'TS', 'Theory'],
    flow: [
      { label: 'Fretboard', detail: 'click a string and fret' },
      { label: 'Note system', detail: 'fret + tuning → pitch' },
      { label: 'Richter layout', detail: 'diatonic reeds for the chosen key' },
      { label: 'Harmonica tab', detail: 'blow, draw, bends + notation' },
    ],
    features: [
      {
        title: 'Fretboard editor',
        text: 'Click notes on the neck, set their duration, undo and redo with Ctrl+Z / Ctrl+Y.',
      },
      {
        title: 'Notation and playback',
        text: 'alphaTab renders standard notation and plays the guitar and harmonica tracks, with the cursor following the selected note.',
      },
      {
        title: 'Tunings and keys',
        text: 'Six tuning presets (standard, drop D, DADGAD, open G...) or a custom one per string, and any harmonica key.',
      },
      {
        title: 'Export',
        text: 'Plain text tabs, or a PNG of the notation with harmonica holes aligned under each note, rasterised natively from the SVG.',
      },
      {
        title: 'Local-first',
        text: 'Projects live in IndexedDB on your device. No account, no backend, a fully static site.',
      },
      {
        title: 'English and Serbian',
        text: 'vue-i18n with both languages, dark mode and fretboard themes.',
      },
    ],
    stack: [
      {
        group: 'Frontend',
        items: ['Vue 3', 'TypeScript', 'Vite', 'Pinia', 'Vue Router', 'vue-i18n'],
      },
      { group: 'Music', items: ['alphaTab', 'Diatonic (Richter) mapping', 'Tuning system'] },
      { group: 'Quality', items: ['Vitest', 'ESLint', 'IndexedDB (idb)'] },
    ],
    links: [
      { label: 'Open GotH', url: 'https://mmileticc.github.io/GotH/', kind: 'live' },
      { label: 'Repository', url: `${GH}/GotH`, kind: 'repo' },
    ],
    repos: ['GotH'],
    images: [
      {
        src: 'images/projects/goth/home-desktop.webp',
        alt: 'GotH home page with the key features',
      },
    ],
  },
];

export function findProject(slug: string | null | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Repositories that are not shown in the gig bag: featured ones and housekeeping repos. */
export const HIDDEN_REPOS = new Set([
  ...PROJECTS.flatMap((p) => p.repos),
  'mmileticc',
  'mmileticc.github.io',
  'portfolio',
  'Local-Eyes-Prototip',
]);

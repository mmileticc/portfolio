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
  /** Featured songs get the full lead sheet; demos are shorter. */
  tier: 'featured' | 'demo';
  /** A playful "genre and key", printed under the title like on sheet music. */
  style: string;
  /** CSS colour of the song's ribbon and accents. */
  color: string;
  tagline: string;
  summary: string;
  problem: string[];
  /** Three main technologies, drawn as chord diagrams. */
  chords: [string, string, string];
  /** The architecture as a chord progression, from input to output. */
  flow: { label: string; detail: string }[];
  features: { title: string; text: string }[];
  stack: { group: string; items: string[] }[];
  links: ProjectLink[];
  /** GitHub repositories that belong to this project (kept out of the B-sides). */
  repos: string[];
  images: ProjectImage[];
}

const GH = 'https://github.com/mmileticc';

export const PROJECTS: Project[] = [
  {
    slug: 'movienee',
    name: 'Movienee',
    tier: 'featured',
    style: 'A cinema ballad in D',
    color: 'var(--song-red)',
    tagline: 'Find a movie, see where it plays in Serbia, and plan a movie night with friends.',
    summary:
      'A movie discovery and social app with a native Android client, an Angular web app and a Kotlin/Ktor backend. One account, library and friend list are shared across all of them.',
    problem: [
      'There is no single place that tells you what is actually playing in Serbian cinemas, where, and when. Every chain has its own website, and none of them knows your taste or your friends.',
      'Movienee puts it together: the catalogue and ratings from TMDB, IMDb and Rotten Tomatoes, the real showtimes of seven cinema chains sorted by distance, and a social layer for watchlists, ratings, comments and joint "Movie Night" suggestions. You can also find a movie from a photo of a poster or by describing the mood you are in.',
    ],
    chords: ['Android', 'Ktor', 'Angular'],
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
    tier: 'featured',
    style: 'A round for seven voices',
    color: 'var(--song-amber)',
    tagline: 'Seven very different cinema websites in, one uniform data model out.',
    summary:
      'Kotlin scrapers that collect the current and upcoming programme of the major cinema chains in Serbia, including every showtime of the next seven days with a link to buy that exact screening.',
    problem: [
      'Cineplexx, CineStar, Cine Grand, MTS Dvorana, Arena, Roda and Tuckwood each publish their programme differently: server-rendered HTML, Nuxt pages with embedded JSON state, a React site backed by a private API, a WordPress theme.',
      'The scrapers read each one in the most reliable way available and produce one row per movie and location, with original titles for matching against TMDB and coordinates for sorting by distance. A real run on 15 October 2026 produced 775 rows and 3,185 showtimes at 20 locations.',
    ],
    chords: ['Kotlin', 'Jsoup', 'Async'],
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
    tier: 'featured',
    style: 'A road song in G',
    color: 'var(--song-green)',
    tagline: 'Scan the QR code on a fuel receipt and get your fuel expenses tracked automatically.',
    summary:
      'An Angular app that reads the QR code from a Serbian fiscal receipt, pulls the station, litres, price and total from the Tax Administration portal and keeps a personal history with statistics. It runs without a backend server of its own.',
    problem: [
      'Every fiscal receipt in Serbia has a QR code that leads to its official copy, but the details you care about (fuel type, litres, price per litre) are behind a "Specification" button, and there is no public API.',
      'The first version used a Python/FastAPI backend that drove headless Chromium. FuelScan is now a standalone Angular app: the browser fetches and parses the receipt page itself, and a small Cloudflare Worker solves the CORS and session-cookie problem.',
    ],
    chords: ['Angular', 'Workers', 'Supabase'],
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
    tier: 'featured',
    style: 'A duet for guitar and harmonica',
    color: 'var(--song-blue)',
    tagline: 'Write a riff on the guitar fretboard, get the harmonica tab, and hear both.',
    summary:
      'GotH (Guitar to Harmonica) is a free browser tool for guitar players learning the diatonic harmonica: click notes on a fretboard and it writes the matching blow and draw holes, with notation and audio playback.',
    problem: [
      'Guitar tabs and harmonica tabs are two different notations. Adapting a blues or folk riff from one to the other means working out every note by hand.',
      'GotH came out of a personal need: as a guitar player learning the harmonica, I wanted to try riffs right away instead of spending hours with music theory manuals. It started as a vanilla JS page and has been rewritten in Vue 3 and TypeScript, with the mapping logic covered by unit tests.',
    ],
    chords: ['Vue', 'TS', 'Theory'],
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
  {
    slug: 'posetrack',
    name: 'PoseTrack',
    tier: 'demo',
    style: 'A workout in 4/4',
    color: 'var(--song-plum)',
    tagline:
      "The phone's camera counts your push-ups and pull-ups and tells you when your form slips.",
    summary:
      'An Android workout tracker that uses ML Kit Pose Detection to follow your movement in real time, count repetitions and keep a history of your training.',
    problem: [
      'Counting reps in your head is easy to get wrong, and a phone propped against the wall can see more than you can. PoseTrack turns it into a personal trainer: it finds 33 body landmarks in every frame, measures joint angles and counts a rep on each full Down → Up transition.',
    ],
    chords: ['Kotlin', 'ML Kit', 'CameraX'],
    flow: [
      { label: 'CameraX', detail: 'frames on a background executor' },
      { label: 'ML Kit Pose', detail: '33 body landmarks' },
      { label: 'Exercise analyzer', detail: 'joint angles, EMA smoothing' },
      { label: 'Room', detail: 'sessions and history' },
    ],
    features: [
      {
        title: 'Automatic counting',
        text: 'Push-ups and pull-ups are counted from the elbow angle and the Down → Up state changes.',
      },
      {
        title: 'Form feedback',
        text: 'Tells you when you are not fully in the frame or your form needs adjusting, and works with only the upper body visible.',
      },
      {
        title: 'Steady tracking',
        text: 'An exponential moving average filter removes the jitter between frames.',
      },
      {
        title: 'Workout diary',
        text: 'Pause, review and save sessions, or log reps by hand when the camera is not used.',
      },
    ],
    stack: [
      { group: 'Android', items: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Hilt', 'Room'] },
      { group: 'Vision', items: ['ML Kit Pose Detection', 'CameraX'] },
    ],
    links: [{ label: 'Repository', url: `${GH}/MLKit-Pose-Exercise-Counter`, kind: 'repo' }],
    repos: ['MLKit-Pose-Exercise-Counter'],
    images: [],
  },
  {
    slug: 'guitar-tuner',
    name: 'Guitar Tuner',
    tier: 'demo',
    style: 'A tuning study in E',
    color: 'var(--song-teal)',
    tagline: 'A clean, ad-free guitar tuner for Android that just works.',
    summary:
      'A lightweight tuner built with Jetpack Compose: real-time pitch analysis with cent deviation, and no ads, tracking or subscriptions.',
    problem: [
      'Most tuners on the Play Store are cluttered with ads and subscriptions. I wanted a straightforward tool for tuning my own guitar, so I built one.',
    ],
    chords: ['Kotlin', 'Compose', 'Audio'],
    flow: [
      { label: 'Microphone', detail: 'started and stopped with the app lifecycle' },
      { label: 'Pitch analysis', detail: 'real-time, in a ViewModel' },
      { label: 'Cents', detail: 'distance from the nearest note' },
      { label: 'Compose UI', detail: 'Material 3' },
    ],
    features: [
      {
        title: 'Precise',
        text: 'Shows the note and how many cents sharp or flat the string is.',
      },
      {
        title: 'Graceful permissions',
        text: "Handles a denied microphone, including 'Don't ask again', and guides you to the system settings.",
      },
      {
        title: 'Battery and privacy',
        text: 'The microphone runs only while the app is in front, following onResume and onPause.',
      },
      {
        title: 'No ads, no tracking',
        text: 'Open source and free of everything that is not tuning.',
      },
    ],
    stack: [
      { group: 'Android', items: ['Kotlin', 'Jetpack Compose', 'Material 3', 'MVVM'] },
      { group: 'Build', items: ['Gradle version catalog'] },
    ],
    links: [{ label: 'Repository', url: `${GH}/Android-Guitar-Tuner`, kind: 'repo' }],
    repos: ['Android-Guitar-Tuner'],
    images: [],
  },
  {
    slug: 'codegrill',
    name: 'CodeGrill',
    tier: 'demo',
    style: 'A roast in three levels',
    color: 'var(--song-slate)',
    tagline:
      'An IntelliJ plugin that roasts your code with AI and turns the useful hints into tasks.',
    summary:
      'Select some Kotlin or Java, ask for a roast, and CodeGrill writes short ROAST, HELP and NICE comments above it. HELP comments become TODOs you can track in a tool window.',
    problem: [
      'Code review feedback is easy to read and forget. CodeGrill makes it a bit more fun and a lot harder to ignore: the hints land in the code itself, and the actionable ones turn into tasks with a progress bar.',
    ],
    chords: ['Kotlin', 'IntelliJ', 'OpenAI'],
    flow: [
      { label: 'Selected code', detail: 'Roast my code, Ctrl+Alt+Q' },
      { label: 'OpenAI', detail: 'level and language from settings' },
      { label: 'Comments', detail: 'ROAST, HELP, NICE' },
      { label: 'Code Tasks', detail: 'HELP → TODO → DONE' },
    ],
    features: [
      {
        title: 'Adjustable heat',
        text: 'Low, Medium or High roast, in English or Serbian.',
      },
      {
        title: 'From hint to task',
        text: 'Gutter icons turn a HELP comment into a TODO and a TODO into DONE.',
      },
      {
        title: 'Progress at a glance',
        text: 'The Code Tasks tool window scans the project, filters by state and jumps to each task.',
      },
      {
        title: 'Clean up',
        text: 'Remove all generated comments, or only the NICE or ROAST ones.',
      },
    ],
    stack: [
      { group: 'Plugin', items: ['Kotlin', 'IntelliJ Platform 2024.2+', 'JDK 21', 'Gradle'] },
      { group: 'AI', items: ['OpenAI API'] },
    ],
    links: [{ label: 'Repository', url: `${GH}/Code-Grill`, kind: 'repo' }],
    repos: ['Code-Grill'],
    images: [],
  },
];

export const FEATURED = PROJECTS.filter((p) => p.tier === 'featured');
export const DEMOS = PROJECTS.filter((p) => p.tier === 'demo');

export function findProject(slug: string | null | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Repositories that are not shown in the B-sides: songs and housekeeping repos. */
export const HIDDEN_REPOS = new Set([
  ...PROJECTS.flatMap((p) => p.repos),
  'mmileticc',
  'mmileticc.github.io',
  'portfolio',
  'Local-Eyes-Prototip',
]);

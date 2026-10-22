# milinko. (portfolio)

My personal site, built as a guitar pedalboard: every featured project is a pedal with its own
manual, the theme switch is a footswitch, and the amp on the home page shows my latest commits.

**Live:** https://mmileticc.github.io/portfolio/

## Stack

Angular 22 (standalone components, signals, zoneless) · static prerendering (`outputMode: 'static'`)
· SCSS with CSS custom properties · Vitest · ESLint · GitHub Actions → GitHub Pages.

## Getting started

Requirements: Node 24.

```bash
npm install
npm start          # generates content, then ng serve on http://localhost:4200
npm test           # unit tests (Vitest)
npm run lint
npm run build      # prerendered site in dist/portfolio/browser
```

## Where things live

| What                                     | Where                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Name, email, LinkedIn, Formspree form ID | `src/app/site.config.ts`                                                                       |
| Featured projects (the pedals)           | `src/app/content/projects.ts`                                                                  |
| Blog posts                               | `content/blog/*.md` (front matter: `title`, `date`, `summary`, `tags`, optional `draft: true`) |
| Project screenshots                      | `public/images/projects/<slug>/`                                                               |
| Share images                             | `public/og/`, regenerate with `npm run og`                                                     |

## How content gets in

`scripts/build-content.ts` runs before `start`, `build` and `test`. It turns the Markdown posts
into `src/app/content/generated/posts.ts` (with Shiki syntax highlighting), takes a snapshot of my
GitHub repositories and latest commits into `generated/github.ts`, and writes `sitemap.xml` and
`robots.txt`. The generated files are not committed.

In the browser, `GithubService` refreshes the GitHub data once per session and silently keeps the
build-time snapshot if the API is unavailable. The deploy workflow also runs daily, so the snapshot
never gets old.

## Deploying

The site is served from `/portfolio/` (`baseHref` in the production build configuration and
`SITE.url` in `site.config.ts`). Pushes to `main` are linted, tested, built and deployed by `.github/workflows/deploy.yml`.
One-time setup in the repository: **Settings → Pages → Source: GitHub Actions**.
After the build, `scripts/postbuild.ts` copies the prerendered `/404` page to `404.html`, which
GitHub Pages serves for unknown URLs.

## Branches

- `main` is what is live. Every push to it deploys.
- `develop` collects the next version. CI (`ci.yml`) lints, tests and builds it without deploying.
- Larger features can go on `feature/<name>` branches off `develop`.
- When a version is ready, open a pull request from `develop` to `main` and merge it to release.


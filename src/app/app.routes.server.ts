import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './content/projects';
import { POSTS } from './content/generated/posts';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((p) => ({ slug: p.slug })),
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => POSTS.map((p) => ({ slug: p.slug })),
  },
  // Unknown URLs are served by GitHub Pages' 404.html (copied from /404 after the build).
  { path: '**', renderMode: RenderMode.Prerender },
];

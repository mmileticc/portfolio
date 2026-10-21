import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../site.config';

export interface PageMeta {
  title?: string;
  description?: string;
  /** Path of the page, e.g. "/projects/goth". */
  path: string;
  /** Path of the share image inside /public, e.g. "og/goth.png". */
  image?: string;
  type?: 'website' | 'article';
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(page: PageMeta): void {
    const title = page.title ? `${page.title} · ${SITE.name}` : `${SITE.name} · Software engineer`;
    const description = page.description ?? SITE.description;
    // GitHub Pages serves each prerendered route as a folder, so its canonical URL ends in a slash.
    const url = `${SITE.url}${page.path === '/' ? '/' : `${page.path}/`}`;
    const image = `${SITE.url}/${page.image ?? 'og/default.png'}`;

    this.title.setTitle(title);
    this.meta.removeTag("name='robots'");
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: page.type ?? 'website' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
}

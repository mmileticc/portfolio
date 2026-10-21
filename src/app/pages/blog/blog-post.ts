import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { POSTS } from '../../content/generated/posts';
import { SeoService } from '../../core/seo.service';
import { formatDate } from '../../core/format';
import NotFound from '../not-found/not-found';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, NotFound],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
  encapsulation: ViewEncapsulation.None,
  // Delegated from the links in the post body; the links themselves stay keyboard accessible.
  host: { '(click)': 'onBodyClick($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogPost {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  /** Bound from the route parameter. */
  readonly slug = input<string>();

  protected readonly post = computed(() => POSTS.find((p) => p.slug === this.slug()));
  // Posts are our own Markdown, rendered at build time, so their HTML (including the inline
  // colour variables of highlighted code) is trusted.
  protected readonly body = computed(() => {
    const post = this.post();
    return post ? this.sanitizer.bypassSecurityTrustHtml(post.html) : '';
  });
  protected readonly formatDate = formatDate;

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const post = this.post();
      if (!post) return;
      seo.set({
        path: `/blog/${post.slug}`,
        title: post.title,
        description: post.summary,
        type: 'article',
      });
    });
  }

  /** Links inside the post body are plain anchors; route the internal ones without a reload. */
  protected onBodyClick(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('.prose a');
    const href = link?.getAttribute('href');
    // Internal links in posts are relative to <base href>; external ones open in a new tab.
    if (!href || link?.target || /^([a-z]+:|#)/i.test(href)) return;
    event.preventDefault();
    void this.router.navigateByUrl(`/${href.replace(/^\.\//, '')}`);
  }
}

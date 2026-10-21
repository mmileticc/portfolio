import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POSTS } from '../../content/generated/posts';
import { SeoService } from '../../core/seo.service';
import { formatDate } from '../../core/format';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  template: `
    <div class="page container">
      <header class="page-head">
        <p class="eyebrow">Setlist</p>
        <h1>Blog</h1>
        <p>Notes on what I build and what I learn along the way.</p>
      </header>

      @if (posts.length) {
        <ol class="setlist">
          @for (post of posts; track post.slug; let i = $index) {
            <li>
              <span class="n mono">{{ i + 1 }}.</span>
              <div>
                <h2>
                  <a [routerLink]="['/blog', post.slug]">{{ post.title }}</a>
                </h2>
                <p class="meta mono">
                  <time [attr.datetime]="post.date">{{ formatDate(post.date) }}</time> ·
                  {{ post.readingMinutes }} min read
                </p>
                <p class="summary">{{ post.summary }}</p>
                @if (post.tags.length) {
                  <p class="tags">
                    @for (tag of post.tags; track tag) {
                      <span class="chip">#{{ tag }}</span>
                    }
                  </p>
                }
              </div>
            </li>
          }
        </ol>
      } @else {
        <p class="empty">The setlist is still being written. Check back soon.</p>
      }
    </div>
  `,
  styles: `
    // A setlist on paper, taped to the stage.
    .setlist {
      position: relative;
      max-width: 820px;
      margin: 0;
      padding: clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px);
      list-style: none;
      background:
        repeating-linear-gradient(180deg, transparent 0 35px, var(--line) 35px 36px), var(--surface);
      border-radius: 6px;
      box-shadow: var(--shadow);
      transform: rotate(-0.8deg);

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: -14px;
        width: 110px;
        height: 30px;
        background: color-mix(in srgb, var(--pedal-orange) 45%, transparent);
        transform: rotate(-4deg);
      }

      &::before {
        left: 30px;
      }

      &::after {
        right: 30px;
        transform: rotate(5deg);
      }

      li {
        display: grid;
        grid-template-columns: 48px 1fr;
        gap: 12px;
        padding-block: 18px;

        & + li {
          border-top: 2px dashed var(--line-strong);
        }
      }
    }

    .n {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--accent);
    }

    h2 {
      font-size: clamp(1.5rem, 3.5vw, 2.1rem);

      a {
        text-decoration: none;

        &:hover {
          color: var(--accent);
        }
      }
    }

    .meta {
      margin-top: 6px;
      font-size: 0.75rem;
      color: var(--muted);
    }

    .summary {
      margin-top: 10px;
      color: var(--ink-soft);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 12px;
    }

    .empty {
      color: var(--muted);
    }

    @media (max-width: 560px) {
      .setlist {
        transform: none;

        li {
          grid-template-columns: 1fr;
          gap: 4px;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogList {
  protected readonly posts = POSTS;
  protected readonly formatDate = formatDate;

  constructor() {
    inject(SeoService).set({
      path: '/blog',
      title: 'Blog',
      description:
        'Notes by Milinko Miletić on Kotlin, Android, Angular and building side projects.',
    });
  }
}

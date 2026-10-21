import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="page container wrap">
      <svg class="broken" viewBox="0 0 320 120" aria-hidden="true">
        <path d="M10 60 C 60 10, 100 110, 140 58" />
        <path d="M180 62 C 220 10, 260 110, 310 60" />
        <rect x="132" y="48" width="22" height="20" rx="4" class="plug" />
        <rect x="168" y="52" width="22" height="20" rx="4" class="plug" />
        <text x="160" y="30" text-anchor="middle">bzzzt</text>
      </svg>
      <p class="eyebrow">Error 404</p>
      <h1>Signal lost.</h1>
      <p class="text">
        This page came unplugged, or it never existed. Let's get you back on the board.
      </p>
      <a routerLink="/" class="btn">Plug back in</a>
    </div>
  `,
  styles: `
    .wrap {
      display: grid;
      justify-items: center;
      text-align: center;
      gap: 14px;
      min-height: 60vh;
      align-content: center;
    }

    .broken {
      width: min(100%, 360px);
      margin-bottom: 10px;

      path {
        fill: none;
        stroke: var(--ink);
        stroke-width: 7;
        stroke-linecap: round;
      }

      .plug {
        fill: #c9c3b8;
        stroke: var(--ink);
        stroke-width: 2;
      }

      text {
        font-family: var(--font-mono);
        font-size: 16px;
        font-weight: 700;
        fill: var(--accent);
        animation: buzz 0.25s steps(2) infinite;
      }
    }

    @keyframes buzz {
      50% {
        transform: translate(1px, -1px);
      }
    }

    h1 {
      font-size: clamp(2.8rem, 9vw, 5rem);
    }

    .text {
      max-width: 44ch;
      color: var(--ink-soft);
      margin-bottom: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFound {
  constructor() {
    inject(SeoService).set({ path: '/404', title: 'Signal lost' });
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }
}

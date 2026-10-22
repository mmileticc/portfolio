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
        <!-- Five strings intact, one snapped and curled at both ends. -->
        @for (y of [30, 45, 60, 90, 105]; track y) {
          <line x1="10" x2="310" [attr.y1]="y" [attr.y2]="y" class="string" />
        }
        <path
          d="M10 75 L 140 75 C 160 75, 168 60, 156 52 C 146 46, 138 58, 150 62"
          class="snapped"
        />
        <path
          d="M310 75 L 190 75 C 172 75, 166 92, 178 98 C 188 102, 194 90, 182 88"
          class="snapped"
        />
        <text x="160" y="22" text-anchor="middle">twang!</text>
      </svg>
      <p class="eyebrow">Error 404</p>
      <h1>A string snapped.</h1>
      <p class="text">
        This page is out of tune, or it never existed. Let's get you back to the songbook.
      </p>
      <a routerLink="/" class="btn">Restring and go home</a>
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

      .string {
        stroke: var(--string);
        stroke-width: 1.6;
      }

      .snapped {
        fill: none;
        stroke: var(--string);
        stroke-width: 2.4;
        stroke-linecap: round;
      }

      text {
        font-family: var(--font-hand);
        font-size: 22px;
        fill: var(--accent);
        animation: twang 0.3s steps(2) infinite;
      }
    }

    @keyframes twang {
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
    inject(SeoService).set({ path: '/404', title: 'A string snapped' });
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }
}

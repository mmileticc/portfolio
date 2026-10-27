import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GITHUB_URL, SITE } from '../../site.config';
import { injectEmail } from '../../core/email';
import { TunerService } from '../../features/tuner/tuner.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="container">
      <div class="back">
        <p class="line">That's the set. Thanks for listening.</p>
        <ul class="links">
          <li><a [href]="githubUrl" target="_blank" rel="noopener">GitHub</a></li>
          @if (site.linkedin) {
            <li><a [href]="site.linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
          }
          @if (email(); as address) {
            <li><a [href]="'mailto:' + address">Email</a></li>
          }
          <li><a routerLink="/contact">Contact</a></li>
          <!-- A static file next to the app, resolved against <base href>. -->
          <li><a href="rss.xml">RSS</a></li>
          <li>
            <button type="button" class="tune" (click)="tuner.open()">Tune up ♪</button>
          </li>
        </ul>
      </div>
      <p class="fine mono">
        © {{ year }} {{ site.name }} · Built with Angular, prerendered for GitHub Pages
      </p>
    </footer>
  `,
  styles: `
    footer {
      padding-block: 24px 40px;
    }

    /* The back of a guitar: rosewood halves joined by a centre strip. */
    .back {
      padding: 32px clamp(20px, 5vw, 48px);
      border-radius: 28px;
      color: #f3e6d3;
      background:
        linear-gradient(90deg, transparent 49.7%, #e8d6a8 49.7% 50.3%, transparent 50.3%),
        repeating-linear-gradient(
          88deg,
          transparent 0 9px,
          rgba(0, 0, 0, 0.18) 9px 10px,
          transparent 10px 23px,
          rgba(255, 255, 255, 0.04) 23px 25px
        ),
        linear-gradient(160deg, #5a2e1d, var(--rosewood) 60%, #2e160d);
      box-shadow: var(--shadow);
    }

    .eyebrow {
      color: #d9b98a;
    }

    .line {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 3vw, 1.9rem);
      font-weight: 600;
      margin-top: 6px;
      max-width: 24ch;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 20px;
      list-style: none;
      padding: 0;
      margin: 18px 0 0;

      a,
      .tune {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: #f2c08f;
        text-underline-offset: 4px;
      }
    }

    .tune {
      padding: 0;
      border: 0;
      background: none;
      text-decoration: underline;
      cursor: pointer;
    }

    .fine {
      margin-top: 18px;
      font-size: 0.72rem;
      color: var(--muted);
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly tuner = inject(TunerService);
  protected readonly site = SITE;
  protected readonly githubUrl = GITHUB_URL;
  protected readonly email = injectEmail();
  protected readonly year = new Date().getFullYear();
}

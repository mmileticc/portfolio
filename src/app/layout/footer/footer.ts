import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GITHUB_URL, SITE } from '../../site.config';
import { injectEmail } from '../../core/email';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="container">
      <div class="amp">
        <div class="grille" aria-hidden="true"></div>
        <div class="body">
          <p class="eyebrow">Output</p>
          <p class="line">Signal chain ends here. Thanks for listening.</p>
          <ul class="links">
            <li><a [href]="githubUrl" target="_blank" rel="noopener">GitHub</a></li>
            @if (site.linkedin) {
              <li><a [href]="site.linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
            }
            @if (email(); as address) {
              <li><a [href]="'mailto:' + address">Email</a></li>
            }
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>
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

    .amp {
      display: grid;
      grid-template-columns: minmax(120px, 220px) 1fr;
      gap: 0;
      overflow: hidden;
      border-radius: var(--radius-lg);
      background: var(--grille);
      color: #f4ecdf;
      box-shadow: var(--shadow);
      border: 6px solid #2f2922;
    }

    .grille {
      background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 7px),
        repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 7px),
        #1a1612;
      border-right: 4px solid #3a332b;
    }

    .body {
      padding: 28px clamp(20px, 4vw, 40px);
    }

    .eyebrow {
      color: #b8ad9b;
    }

    .line {
      font-family: var(--font-display);
      font-size: clamp(1.3rem, 3vw, 1.8rem);
      font-weight: 700;
      margin-top: 6px;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
      list-style: none;
      padding: 0;
      margin: 18px 0 0;

      a {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: #ffb27f;
        text-underline-offset: 4px;
      }
    }

    .fine {
      margin-top: 18px;
      font-size: 0.72rem;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 560px) {
      .amp {
        grid-template-columns: 1fr;
      }

      .grille {
        height: 56px;
        border-right: 0;
        border-bottom: 4px solid #3a332b;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly githubUrl = GITHUB_URL;
  protected readonly email = injectEmail();
  protected readonly year = new Date().getFullYear();
}

import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { GithubService } from '../../core/github.service';
import { timeAgo } from '../../core/format';

/** A practice notebook page listing the latest commits. */
@Component({
  selector: 'app-practice-log',
  template: `
    <section class="log paper" aria-labelledby="practice-title">
      <header>
        <h2 id="practice-title">Now practicing</h2>
        <span
          class="hand status"
          [title]="github.live() ? 'Live from GitHub' : 'Snapshot from the last build'"
        >
          {{ github.live() ? 'live from GitHub' : 'from the last build' }}
        </span>
      </header>

      @if (github.commits().length) {
        <ol>
          @for (c of github.commits().slice(0, 3); track c.url) {
            <li>
              <a [href]="c.url" target="_blank" rel="noopener">
                <span class="repo mono">{{ c.repo }}</span>
                <span class="msg">{{ c.message }}</span>
                <span class="when mono">{{ ago(c.date) }}</span>
              </a>
            </li>
          }
        </ol>
      } @else {
        <p class="empty">Taking a short break between songs.</p>
      }
    </section>
  `,
  styles: `
    .log {
      padding: 22px 22px 18px 52px;
      position: relative;
      /* Ruled notebook paper with a margin line. */
      background:
        linear-gradient(
          90deg,
          transparent 38px,
          rgba(184, 69, 47, 0.35) 38px 40px,
          transparent 40px
        ),
        repeating-linear-gradient(180deg, transparent 0 27px, rgba(54, 100, 156, 0.16) 27px 28px),
        var(--paper);
      transform: rotate(1.5deg);
    }

    header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 1.5rem;
    }

    .status {
      font-size: 1.15rem;
      white-space: nowrap;
    }

    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li + li {
      border-top: 1px dashed var(--line-strong);
    }

    a {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2px 12px;
      padding: 9px 0;
      text-decoration: none;
    }

    a:hover .msg {
      color: var(--accent);
    }

    .repo {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .when {
      font-size: 0.7rem;
      color: var(--muted);
    }

    .msg {
      grid-column: 1 / -1;
      font-size: 0.95rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty {
      color: var(--muted);
    }

    @media (max-width: 480px) {
      .log {
        transform: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticeLog {
  protected readonly github = inject(GithubService);
  protected readonly ago = timeAgo;

  constructor() {
    afterNextRender(() => this.github.refresh());
  }
}

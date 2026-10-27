import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';

/** Theme toggle drawn as a guitar tuning peg that turns half a revolution. */
@Component({
  selector: 'app-tuning-peg',
  template: `
    <button
      type="button"
      class="peg-btn"
      role="switch"
      [attr.aria-checked]="theme.isDark()"
      [attr.title]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      (click)="theme.toggle()"
    >
      <svg viewBox="0 0 40 24" aria-hidden="true" [class.turned]="theme.isDark()">
        <rect x="0" y="9" width="14" height="6" rx="2" class="shaft" />
        <circle cx="14" cy="12" r="5" class="post" />
        <path d="M18 12 C 18 3, 38 2, 38 12 C 38 22, 18 21, 18 12 Z" class="key" />
      </svg>
      <span class="text mono">{{ theme.isDark() ? 'DARK' : 'LIGHT' }}</span>
      <span class="visually-hidden">Dark mode</span>
    </button>
  `,
  styles: `
    .peg-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px 6px 8px;
      border-radius: 999px;
      border: 1px solid var(--line-strong);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
    }

    svg {
      width: 34px;
      height: 22px;
      transition: transform 0.6s var(--ease-spring);
      transform-origin: 14px 12px;
    }

    svg.turned {
      transform: rotateX(180deg) rotate(25deg);
    }

    .shaft {
      fill: #b9a77f;
    }

    .post {
      fill: #d8c79f;
      stroke: #7a6a48;
      stroke-width: 1.5;
    }

    .key {
      fill: var(--ink);
      opacity: 0.85;
    }

    .peg-btn:hover svg:not(.turned) {
      transform: rotate(-20deg);
    }

    .text {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      min-width: 5ch;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuningPeg {
  protected readonly theme = inject(ThemeService);
}

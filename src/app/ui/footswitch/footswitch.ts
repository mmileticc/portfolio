import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { Led } from '../led/led';

/** Theme toggle styled as a stomp switch. Engaged (LED on) means dark mode. */
@Component({
  selector: 'app-footswitch',
  imports: [Led],
  template: `
    <button
      type="button"
      class="switch"
      role="switch"
      [attr.aria-checked]="theme.isDark()"
      [attr.title]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      (click)="theme.toggle()"
    >
      <app-led [on]="theme.isDark()" color="#ffb02e" />
      <span class="stomp" aria-hidden="true"></span>
      <span class="text mono">{{ theme.isDark() ? 'DARK' : 'LIGHT' }}</span>
      <span class="visually-hidden">Dark mode</span>
    </button>
  `,
  styles: `
    .switch {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px 6px 10px;
      border-radius: 999px;
      border: 1px solid var(--line-strong);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      --led-size: 8px;
    }

    .stomp {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #f6f2ea 0%, #a8a196 60%, #6e685f 100%);
      box-shadow:
        0 3px 0 #4a453f,
        inset 0 -2px 3px rgba(0, 0, 0, 0.25);
      transition:
        transform 0.08s ease,
        box-shadow 0.08s ease;
    }

    .switch:active .stomp {
      transform: translateY(3px);
      box-shadow:
        0 0 0 #4a453f,
        inset 0 -1px 2px rgba(0, 0, 0, 0.25);
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
export class Footswitch {
  protected readonly theme = inject(ThemeService);
}

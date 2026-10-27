import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SoundService } from '../../core/sound.service';

@Component({
  selector: 'app-sound-toggle',
  template: `
    <button
      type="button"
      class="sound"
      [attr.aria-pressed]="sound.enabled()"
      [attr.title]="sound.enabled() ? 'Mute the strings' : 'Let the strings ring'"
      (click)="sound.toggle()"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" class="body" />
        @if (sound.enabled()) {
          <path d="M16 8.5c1.2 1 1.8 2.2 1.8 3.5s-.6 2.5-1.8 3.5" />
          <path d="M18.5 6c2 1.6 3 3.6 3 6s-1 4.4-3 6" />
        } @else {
          <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />
        }
      </svg>
      <span class="visually-hidden">Sound</span>
    </button>
  `,
  styles: `
    .sound {
      display: inline-grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid var(--line-strong);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
    }

    .sound[aria-pressed='true'] {
      color: var(--accent);
      border-color: var(--accent);
    }

    svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .body {
      fill: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundToggle {
  protected readonly sound = inject(SoundService);
}

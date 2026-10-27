import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { STANDARD_TUNING, SoundService } from '../../core/sound.service';

/**
 * Six guitar strings used as a divider between sections. Brushing over a string makes it
 * vibrate and, if sound is on, ring at its real pitch.
 */
@Component({
  selector: 'app-strings',
  template: `
    @for (s of strings; track $index; let i = $index) {
      <span
        class="hit"
        [class.ringing]="ringing()[i]"
        [style.--thickness.px]="thickness(i)"
        (pointerenter)="pluck(i)"
        (pointerdown)="pluck(i)"
      >
        <span class="string" (animationend)="stop(i)"></span>
      </span>
    }
    @if (label()) {
      <span class="label hand">{{ label() }}</span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      gap: 0;
      max-width: var(--max);
      margin-inline: auto;
      padding: 8px var(--gutter);
      /* aria-hidden: purely decorative, the page reads the same without it. */
    }

    .hit {
      display: flex;
      align-items: center;
      height: 11px;
      cursor: crosshair;
      touch-action: pan-y;
    }

    .string {
      display: block;
      width: 100%;
      height: var(--thickness);
      border-radius: 2px;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--string) 60%, #fff),
        var(--string)
      );
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.18);
      transform-origin: center;
    }

    /* Wound strings (the low three) get a fine winding texture. */
    .hit:nth-child(-n + 3) .string {
      background:
        repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.18) 0 1px, transparent 1px 3px),
        linear-gradient(180deg, color-mix(in srgb, var(--string) 60%, #fff), var(--string));
    }

    .ringing .string {
      animation: ring 0.9s linear;
    }

    @keyframes ring {
      0% {
        transform: translateY(0);
      }
      5% {
        transform: translateY(-3px);
      }
      10% {
        transform: translateY(2.6px);
      }
      16% {
        transform: translateY(-2.2px);
      }
      23% {
        transform: translateY(1.8px);
      }
      31% {
        transform: translateY(-1.4px);
      }
      40% {
        transform: translateY(1px);
      }
      52% {
        transform: translateY(-0.7px);
      }
      66% {
        transform: translateY(0.4px);
      }
      82% {
        transform: translateY(-0.2px);
      }
      100% {
        transform: translateY(0);
      }
    }

    .label {
      position: absolute;
      right: var(--gutter);
      top: -18px;
      font-size: 1.4rem;
      transform: rotate(-3deg);
      pointer-events: none;
    }
  `,
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Strings {
  private readonly sound = inject(SoundService);

  /** Optional handwritten note next to the strings. */
  readonly label = input('');

  protected readonly strings = STANDARD_TUNING;
  protected readonly ringing = signal<boolean[]>(STANDARD_TUNING.map(() => false));

  /** Low E is the thickest, high E the thinnest. */
  protected thickness(i: number): number {
    return [3, 2.6, 2.2, 1.7, 1.3, 1][i];
  }

  protected pluck(i: number): void {
    if (this.ringing()[i]) return;
    this.ringing.update((r) => r.map((v, j) => (j === i ? true : v)));
    this.sound.pluck(this.strings[i].hz);
  }

  protected stop(i: number): void {
    this.ringing.update((r) => r.map((v, j) => (j === i ? false : v)));
  }
}

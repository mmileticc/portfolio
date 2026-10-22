import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { STANDARD_TUNING, SoundService } from '../../core/sound.service';

/**
 * The soundhole of an acoustic guitar with its rosette, seen from the front, strings and all.
 * The strings can be strummed with the pointer.
 */
@Component({
  selector: 'app-soundhole',
  template: `
    <svg viewBox="0 0 400 440" aria-hidden="true">
      <defs>
        <clipPath id="soundhole-top">
          <rect x="0" y="0" width="400" height="440" rx="200" />
        </clipPath>
        <radialGradient id="soundhole-depth" cx="50%" cy="45%" r="55%">
          <stop offset="0" stop-color="#1a0f0a" />
          <stop offset="1" stop-color="#050302" />
        </radialGradient>
      </defs>

      <g clip-path="url(#soundhole-top)">
        <rect width="400" height="440" class="top" />
        @for (y of grain; track y) {
          <line x1="0" x2="400" [attr.y1]="y" [attr.y2]="y + 6" class="grain" />
        }
      </g>

      <!-- Rosette: a mosaic ring between thin purflings. -->
      <circle cx="200" cy="200" r="128" class="purfling" />
      <circle cx="200" cy="200" r="122" class="purfling thin" />
      <circle cx="200" cy="200" r="114" class="mosaic a" />
      <circle cx="200" cy="200" r="114" class="mosaic b" />
      <circle cx="200" cy="200" r="106" class="purfling thin" />
      <circle cx="200" cy="200" r="101" class="purfling" />
      <circle cx="200" cy="200" r="92" fill="url(#soundhole-depth)" />

      <!-- Strings over the soundhole, low E on the left. -->
      @for (s of strings; track $index; let i = $index) {
        <g
          class="string"
          [class.ringing]="ringing()[i]"
          (pointerenter)="pluck(i)"
          (pointerdown)="pluck(i)"
          (animationend)="stop(i)"
        >
          <rect [attr.x]="x(i) - 7" y="0" width="14" height="440" class="hit" />
          <line [attr.x1]="x(i)" [attr.x2]="x(i)" y1="0" y2="440" [attr.stroke-width]="width(i)" />
        </g>
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      filter: drop-shadow(0 30px 40px rgba(60, 30, 10, 0.35));
    }

    .top {
      fill: var(--spruce);
    }

    .grain {
      stroke: var(--spruce-dark);
      stroke-width: 1;
      opacity: 0.35;
    }

    .purfling {
      fill: none;
      stroke: var(--rosewood);
      stroke-width: 3;
    }

    .purfling.thin {
      stroke-width: 1.5;
      stroke: var(--mahogany);
    }

    .mosaic {
      fill: none;
      stroke-width: 12;
    }

    .mosaic.a {
      stroke: var(--rosewood);
    }

    .mosaic.b {
      stroke: #e8d6a8;
      stroke-dasharray: 4 6;
    }

    .string line {
      stroke: #d6c7a3;
      stroke-linecap: round;
    }

    .string:nth-of-type(-n + 3) line {
      stroke: #b89f6a;
    }

    .hit {
      fill: transparent;
      cursor: crosshair;
    }

    .ringing {
      animation: ring 0.9s linear;
    }

    @keyframes ring {
      0% {
        transform: translateX(0);
      }
      5% {
        transform: translateX(-3px);
      }
      10% {
        transform: translateX(2.6px);
      }
      16% {
        transform: translateX(-2.2px);
      }
      23% {
        transform: translateX(1.8px);
      }
      31% {
        transform: translateX(-1.4px);
      }
      40% {
        transform: translateX(1px);
      }
      52% {
        transform: translateX(-0.7px);
      }
      66% {
        transform: translateX(0.4px);
      }
      82% {
        transform: translateX(-0.2px);
      }
      100% {
        transform: translateX(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Soundhole {
  private readonly sound = inject(SoundService);

  protected readonly strings = STANDARD_TUNING;
  protected readonly ringing = signal<boolean[]>(STANDARD_TUNING.map(() => false));
  protected readonly grain = Array.from({ length: 30 }, (_, i) => i * 15 + (i % 3) * 3);

  protected x(i: number): number {
    return 150 + i * 20;
  }

  protected width(i: number): number {
    return [3.2, 2.8, 2.3, 1.8, 1.4, 1.1][i];
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

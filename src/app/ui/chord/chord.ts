import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Real open-chord shapes, low E to high E: fret number, 0 = open, -1 = muted.
 * They are decoration; the label under the diagram is what matters.
 */
const SHAPES: Record<string, number[]> = {
  C: [-1, 3, 2, 0, 1, 0],
  G: [3, 2, 0, 0, 0, 3],
  Am: [-1, 0, 2, 2, 1, 0],
  Em: [0, 2, 2, 0, 0, 0],
  D: [-1, -1, 0, 2, 3, 2],
  E: [0, 2, 2, 1, 0, 0],
};
const ORDER = ['G', 'C', 'D', 'Em', 'Am', 'E'];

const LEFT = 8;
const GAP = 9; // between strings
const TOP = 12;
const FRET = 12; // between frets

/** A chord box like the ones above the lyrics in a songbook, labelled with a technology. */
@Component({
  selector: 'app-chord',
  template: `
    <svg viewBox="0 0 61 66" aria-hidden="true">
      <rect [attr.x]="left" [attr.y]="top - 3" [attr.width]="gap * 5" height="3" class="nut" />
      @for (f of frets; track f) {
        <line
          [attr.x1]="left"
          [attr.x2]="left + gap * 5"
          [attr.y1]="top + f * fret"
          [attr.y2]="top + f * fret"
        />
      }
      @for (x of xs; track x) {
        <line [attr.x1]="x" [attr.x2]="x" [attr.y1]="top" [attr.y2]="top + fret * 4" />
      }
      @for (m of marks(); track $index) {
        @if (m.fret > 0) {
          <circle [attr.cx]="m.x" [attr.cy]="top + (m.fret - 0.5) * fret" r="3.6" class="dot" />
        } @else if (m.fret === 0) {
          <circle [attr.cx]="m.x" [attr.cy]="top - 8" r="2.4" class="open" />
        } @else {
          <text [attr.x]="m.x" [attr.y]="top - 5" text-anchor="middle" class="mute">×</text>
        }
      }
    </svg>
    <span class="label">{{ label() }}</span>
  `,
  styles: `
    :host {
      max-width: 100%;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 0;
      color: var(--chord-ink, currentColor);
    }

    svg {
      width: var(--chord-size, 52px);
      height: auto;
      overflow: visible;
    }

    line {
      stroke: currentColor;
      stroke-width: 1;
      opacity: 0.55;
    }

    .nut,
    .dot {
      fill: currentColor;
    }

    .open {
      fill: none;
      stroke: currentColor;
      stroke-width: 1;
    }

    .mute {
      fill: currentColor;
      font-size: 8px;
      opacity: 0.7;
    }

    .label {
      display: var(--chord-label-display, block);
      max-width: 100%;
      padding-inline: 1px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--font-hand);
      font-size: 1rem;
      line-height: 1.15;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chord {
  /** What the chord stands for, e.g. a technology. */
  readonly label = input('');
  /** Picks one of a few common open-chord shapes. */
  readonly shape = input(0);

  protected readonly left = LEFT;
  protected readonly top = TOP;
  protected readonly gap = GAP;
  protected readonly fret = FRET;
  protected readonly frets = [0, 1, 2, 3, 4];
  protected readonly xs = [0, 1, 2, 3, 4, 5].map((i) => LEFT + i * GAP);

  protected readonly shapeName = computed(() => ORDER[this.shape() % ORDER.length]);
  protected readonly marks = computed(() =>
    SHAPES[this.shapeName()].map((fret, i) => ({ fret, x: LEFT + i * GAP })),
  );
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A decorative pedal knob. `value` 0–10 maps to the pointer angle (and yes, it goes to 11). */
@Component({
  selector: 'app-knob',
  template: `
    <span class="cap" [style.--angle.deg]="angle()"><span class="pointer"></span></span>
    @if (label()) {
      <span class="label">{{ label() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .cap {
      position: relative;
      width: var(--knob-size, 38px);
      height: var(--knob-size, 38px);
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #4a4540 0%, #1b1916 70%), #1b1916;
      box-shadow:
        0 3px 0 rgba(0, 0, 0, 0.35),
        0 0 0 3px rgba(0, 0, 0, 0.18),
        inset 0 1px 1px rgba(255, 255, 255, 0.25);
      transform: rotate(calc(var(--angle) + var(--knob-turn, 0deg)));
      transition: transform 0.5s var(--ease-spring);
    }

    .pointer {
      position: absolute;
      left: 50%;
      top: 12%;
      width: 3px;
      height: 34%;
      margin-left: -1.5px;
      border-radius: 2px;
      background: #f4ecdf;
    }

    .label {
      display: var(--knob-label-display, block);
      font-family: var(--font-mono);
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--knob-label, rgba(0, 0, 0, 0.72));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 10ch;
    }
  `,
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Knob {
  readonly label = input('');
  readonly value = input(5);

  /** 0 → -135°, 10 → +135°, like a real pot. */
  protected angle(): number {
    const v = Math.min(11, Math.max(0, this.value()));
    return -135 + v * 27;
  }
}

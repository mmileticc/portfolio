import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A patch cable that runs between two sections. It draws itself as it scrolls
 * into view where scroll-driven animations are supported, and is simply drawn otherwise.
 */
@Component({
  selector: 'app-cable',
  template: `
    <svg viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true">
      <path class="shadow" [attr.d]="d()" vector-effect="non-scaling-stroke" />
      <path class="wire" [attr.d]="d()" vector-effect="non-scaling-stroke" />
    </svg>
    <span class="plug top"></span>
    <span class="plug bottom" [class.right]="flip()"></span>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      height: var(--cable-height, 160px);
      max-width: 520px;
      margin-inline: auto;
      pointer-events: none;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    path {
      fill: none;
      stroke-linecap: round;
    }

    .shadow {
      stroke: rgba(0, 0, 0, 0.18);
      stroke-width: 9px;
      transform: translate(0, 4px);
    }

    .wire {
      stroke: var(--cable-color, var(--ink));
      stroke-width: 7px;
    }

    .plug {
      position: absolute;
      width: 16px;
      height: 26px;
      border-radius: 4px 4px 6px 6px;
      background: linear-gradient(90deg, #6f6a62, #d9d3c8 45%, #6f6a62);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
      left: calc(10% - 8px);
    }

    .plug.top {
      top: -18px;
    }

    .plug.bottom {
      bottom: -18px;
      left: calc(10% - 8px);
    }

    .plug.bottom.right {
      left: calc(90% - 8px);
    }

    @supports (animation-timeline: view()) {
      @media (prefers-reduced-motion: no-preference) {
        svg,
        .plug.bottom {
          animation: plug-in linear both;
          animation-timeline: view();
          animation-range: entry 0% cover 50%;
        }
      }
    }

    /* The cable unrolls from the top plug down to the bottom one. */
    @keyframes plug-in {
      from {
        clip-path: inset(0 0 100% 0);
      }
      to {
        clip-path: inset(0 0 -20px 0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cable {
  /** When true, the cable ends on the right side instead of the left. */
  readonly flip = input(false);

  protected d(): string {
    return this.flip()
      ? 'M20 0 C 20 90, 180 60, 180 160'
      : 'M20 0 C 20 70, 170 40, 170 100 S 20 120, 20 160';
  }
}

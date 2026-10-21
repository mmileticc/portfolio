import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-led',
  template: '',
  styles: `
    :host {
      display: inline-block;
      width: var(--led-size, 10px);
      height: var(--led-size, 10px);
      border-radius: 50%;
      background: color-mix(in srgb, var(--led-color, var(--led)) 30%, #3a2a24);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
      transition:
        background 0.15s ease,
        box-shadow 0.15s ease;
      flex: none;
    }

    :host(.on) {
      background: var(--led-color, var(--led));
      box-shadow:
        0 0 6px 1px var(--led-color, var(--led)),
        0 0 16px 2px color-mix(in srgb, var(--led-color, var(--led)) 60%, transparent);
    }
  `,
  host: {
    'aria-hidden': 'true',
    '[class.on]': 'on()',
    '[style.--led-color]': 'color()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Led {
  readonly on = input(false);
  readonly color = input<string | undefined>(undefined);
}

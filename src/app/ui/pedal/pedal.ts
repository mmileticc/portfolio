import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../content/projects';
import { Knob } from '../knob/knob';
import { Led } from '../led/led';

/** A featured project drawn as an effects pedal. Stomping it opens the case study. */
@Component({
  selector: 'app-pedal',
  imports: [RouterLink, Knob, Led],
  template: `
    <a
      class="pedal"
      [class.sm]="size() === 'sm'"
      [class.lit]="lit()"
      [routerLink]="['/projects', project().slug]"
      [style.--enclosure]="project().color"
      [style.--enclosure-ink]="project().ink"
      (mouseenter)="lit.set(true)"
      (mouseleave)="lit.set(false)"
      (focus)="lit.set(true)"
      (blur)="lit.set(false)"
    >
      <span class="screw tl"></span><span class="screw tr"></span> <span class="screw bl"></span
      ><span class="screw br"></span>

      <span class="knobs">
        @for (k of project().knobs; track k; let i = $index) {
          <app-knob [label]="k" [value]="knobValues[i]" />
        }
      </span>

      <span class="face">
        <app-led [on]="lit() || alwaysOn()" />
        <span class="model">{{ project().model }}</span>
        <span class="name">{{ project().name }}</span>
      </span>

      <span class="stomp" aria-hidden="true"></span>
      <span class="visually-hidden">: open case study</span>
    </a>
  `,
  styleUrl: './pedal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pedal {
  readonly project = input.required<Project>();
  readonly size = input<'lg' | 'sm'>('lg');
  /** Keep the LED lit, e.g. on the project's own page. */
  readonly alwaysOn = input(false);

  protected readonly lit = signal(false);
  protected readonly knobValues = [7, 4, 8.5];
}

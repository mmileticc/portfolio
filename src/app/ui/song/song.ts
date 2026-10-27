import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../content/projects';
import { Chord } from '../chord/chord';

/** A project as a page from a songbook: title, style, and its main technologies as chords. */
@Component({
  selector: 'app-song',
  imports: [RouterLink, NgTemplateOutlet, Chord],
  template: `
    @if (link()) {
      <a
        class="song paper"
        [class.sm]="size() === 'sm'"
        [routerLink]="['/projects', project().slug]"
        [style.--song]="project().color"
      >
        <ng-container [ngTemplateOutlet]="page" />
        <span class="play hand" aria-hidden="true">play it →</span>
        <span class="visually-hidden">
          Open the case study. Built with {{ project().chords.join(', ') }}.
        </span>
      </a>
    } @else {
      <div class="song paper static" [class.sm]="size() === 'sm'" [style.--song]="project().color">
        <ng-container [ngTemplateOutlet]="page" />
      </div>
    }

    <ng-template #page>
      <span class="ribbon" aria-hidden="true"></span>
      <span class="no mono">No. {{ number() }}</span>

      <span class="title">{{ project().name }}</span>
      <span class="style">{{ project().style }}</span>

      <span class="chords">
        @for (c of project().chords; track c; let i = $index) {
          <app-chord [label]="c" [shape]="number() + i" />
        }
      </span>

      <span class="staff" aria-hidden="true"></span>
    </ng-template>
  `,
  styleUrl: './song.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Song {
  readonly project = input.required<Project>();
  /** Page number in the songbook. */
  readonly number = input(1);
  readonly size = input<'lg' | 'sm'>('lg');
  /** Off when the card is shown on its own lead sheet, where a link would point to itself. */
  readonly link = input(true);
}

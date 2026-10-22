import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, findProject } from '../../content/projects';
import { SeoService } from '../../core/seo.service';
import { Chord } from '../../ui/chord/chord';
import { Song } from '../../ui/song/song';
import NotFound from '../not-found/not-found';

/** A project's lead sheet. Sections are marked A, B, C… like rehearsal marks in a score. */
@Component({
  selector: 'app-case-study',
  imports: [RouterLink, Song, Chord, NotFound],
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CaseStudy {
  /** Bound from the route parameter. */
  readonly slug = input<string>();

  protected readonly project = computed(() => findProject(this.slug()));
  /** Position in the songbook, counting from 1. */
  protected readonly number = computed(() => PROJECTS.findIndex((p) => p.slug === this.slug()) + 1);
  protected readonly next = computed(() => {
    const i = PROJECTS.findIndex((p) => p.slug === this.slug());
    return i === -1 ? undefined : PROJECTS[(i + 1) % PROJECTS.length];
  });

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.project();
      if (!p) return;
      seo.set({
        path: `/projects/${p.slug}`,
        title: p.name,
        description: `${p.tagline} ${p.summary}`,
        image: `og/${p.slug}.png`,
      });
    });
  }
}

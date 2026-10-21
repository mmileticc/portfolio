import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, findProject } from '../../content/projects';
import { SeoService } from '../../core/seo.service';
import { Pedal } from '../../ui/pedal/pedal';
import NotFound from '../not-found/not-found';

@Component({
  selector: 'app-case-study',
  imports: [RouterLink, Pedal, NotFound],
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CaseStudy {
  /** Bound from the route parameter. */
  readonly slug = input<string>();

  protected readonly project = computed(() => findProject(this.slug()));
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

import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HIDDEN_REPOS, PROJECTS } from '../../content/projects';
import { GithubService } from '../../core/github.service';
import { SeoService } from '../../core/seo.service';
import { timeAgo } from '../../core/format';
import { Pedal } from '../../ui/pedal/pedal';
import { GITHUB_URL } from '../../site.config';

/** GitHub's own language colours for the ones that show up here. */
const LANGUAGE_COLORS: Record<string, string> = {
  Kotlin: '#a97bff',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Vue: '#41b883',
  HTML: '#e34c26',
  Python: '#3572a5',
};

@Component({
  selector: 'app-board',
  imports: [Pedal],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Board {
  private readonly github = inject(GithubService);

  protected readonly projects = PROJECTS;
  protected readonly githubUrl = GITHUB_URL;
  protected readonly ago = timeAgo;
  protected readonly language = signal<string | null>(null);

  protected readonly gigBag = computed(() =>
    this.github.repos().filter((r) => !HIDDEN_REPOS.has(r.name)),
  );

  protected readonly languages = computed(() => {
    const counts = new Map<string, number>();
    for (const r of this.gigBag()) {
      if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  });

  protected readonly visible = computed(() => {
    const lang = this.language();
    return lang ? this.gigBag().filter((r) => r.language === lang) : this.gigBag();
  });

  constructor() {
    inject(SeoService).set({
      path: '/projects',
      title: 'Projects',
      description:
        'Featured projects by Milinko Miletić (Movienee, Movienee Scrapers, FuelScan, GotH) and everything else from GitHub.',
    });
    afterNextRender(() => this.github.refresh());
  }

  protected color(lang: string | null): string {
    return (lang && LANGUAGE_COLORS[lang]) || 'var(--muted)';
  }

  protected toggle(lang: string): void {
    this.language.update((current) => (current === lang ? null : lang));
  }
}

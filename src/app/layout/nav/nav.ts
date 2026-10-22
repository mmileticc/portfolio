import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SoundToggle } from '../../ui/sound-toggle/sound-toggle';
import { TuningPeg } from '../../ui/tuning-peg/tuning-peg';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, TuningPeg, SoundToggle],
  template: `
    <header class="bar">
      <div class="container inner">
        <a routerLink="/" class="brand" aria-label="Milinko Miletić, home">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="var(--spruce)"
              stroke="var(--ink)"
              stroke-width="3"
            />
            <circle cx="32" cy="32" r="21" fill="none" stroke="var(--rosewood)" stroke-width="5" />
            <circle
              cx="32"
              cy="32"
              r="21"
              fill="none"
              stroke="#e8d6a8"
              stroke-width="5"
              stroke-dasharray="2 3"
            />
            <circle cx="32" cy="32" r="15" fill="#120a06" />
            <path d="M26 3v58M32 3v58M38 3v58" stroke="#b89f6a" stroke-width="1.6" />
          </svg>
          <span>milinko<span class="dot">.</span></span>
        </a>

        <button
          type="button"
          class="menu-toggle"
          [attr.aria-expanded]="open()"
          aria-controls="site-menu"
          (click)="open.set(!open())"
        >
          <span class="bars" [class.x]="open()" aria-hidden="true"><span></span></span>
          <span class="visually-hidden">Menu</span>
        </button>

        <nav id="site-menu" class="menu" [class.open]="open()" aria-label="Main">
          <ul>
            @for (link of links; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  routerLinkActive="active"
                  ariaCurrentWhenActive="page"
                  [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                  >{{ link.label }}</a
                >
              </li>
            }
          </ul>
          <div class="controls">
            <app-sound-toggle />
            <app-tuning-peg />
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  protected readonly open = signal(false);
  protected readonly links = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }
}

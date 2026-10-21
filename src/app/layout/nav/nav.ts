import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Footswitch } from '../../ui/footswitch/footswitch';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, Footswitch],
  template: `
    <header class="bar">
      <div class="container inner">
        <a routerLink="/" class="brand" aria-label="Milinko Miletić, home">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <rect
              x="10"
              y="4"
              width="44"
              height="56"
              rx="8"
              fill="var(--pedal-red)"
              stroke="var(--ink)"
              stroke-width="3"
            />
            <circle cx="22" cy="17" r="5" fill="var(--ink)" />
            <circle cx="42" cy="17" r="5" fill="var(--ink)" />
            <circle cx="32" cy="30" r="3" fill="#ffd23f" />
            <circle cx="32" cy="46" r="7" fill="#d8d2c6" stroke="var(--ink)" stroke-width="3" />
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
          <app-footswitch />
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

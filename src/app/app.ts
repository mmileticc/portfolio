import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer';
import { Nav } from './layout/nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer],
  template: `
    <a class="skip" href="#main">Skip to content</a>
    <app-nav />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: `
    .skip {
      position: absolute;
      left: 12px;
      top: -60px;
      z-index: 50;
      padding: 10px 14px;
      border-radius: 10px;
      background: var(--accent);
      color: var(--accent-ink);
      font-family: var(--font-mono);
      font-weight: 700;
      text-decoration: none;
    }

    .skip:focus {
      top: 12px;
    }

    main:focus {
      outline: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}

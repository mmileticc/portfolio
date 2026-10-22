import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer';
import { Nav } from './layout/nav/nav';
import { Tuner } from './features/tuner/tuner';
import { TunerService } from './features/tuner/tuner.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, Tuner],
  template: `
    <a class="skip" href="#main" (click)="skipToContent($event)">Skip to content</a>
    <app-nav />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <!-- The tuner's code is fetched the first time someone opens it. -->
    @defer (when tuner.loaded()) {
      <app-tuner />
    }
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
export class App {
  protected readonly tuner = inject(TunerService);

  /** With <base href> set, "#main" would resolve to the home page, so move focus by hand. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}

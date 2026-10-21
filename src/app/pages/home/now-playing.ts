import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { GithubService } from '../../core/github.service';
import { timeAgo } from '../../core/format';
import { Knob } from '../../ui/knob/knob';
import { Led } from '../../ui/led/led';

/** An amp head whose display shows the latest commits. */
@Component({
  selector: 'app-now-playing',
  imports: [Knob, Led],
  template: `
    <div class="amp">
      <div class="panel">
        <span class="plate">MILINKO</span>
        <div class="controls" aria-hidden="true">
          <app-knob label="Gain" [value]="8" />
          <app-knob label="Treble" [value]="6" />
          <app-knob label="Bass" [value]="4" />
          <app-knob label="Vol" [value]="11" />
        </div>
      </div>

      <section class="screen" aria-labelledby="now-playing-title">
        <header>
          <h2 id="now-playing-title" class="mono">Now playing</h2>
          <span
            class="status mono"
            [title]="github.live() ? 'Live from GitHub' : 'Snapshot from the last build'"
          >
            <app-led [on]="true" [color]="github.live() ? '#3ddc84' : '#ffb02e'" />
            {{ github.live() ? 'live' : 'cached' }}
          </span>
        </header>

        @if (github.commits().length) {
          <ol>
            @for (c of github.commits().slice(0, 3); track c.url) {
              <li>
                <a [href]="c.url" target="_blank" rel="noopener">
                  <span class="repo">{{ c.repo }}</span>
                  <span class="msg">{{ c.message }}</span>
                  <span class="when">{{ ago(c.date) }}</span>
                </a>
              </li>
            }
          </ol>
        } @else {
          <p class="empty mono">Tuning up... no recent commits to show.</p>
        }
      </section>

      <div class="grille" aria-hidden="true"></div>
    </div>
  `,
  styleUrl: './now-playing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlaying {
  protected readonly github = inject(GithubService);
  protected readonly ago = timeAgo;

  constructor() {
    afterNextRender(() => this.github.refresh());
  }
}

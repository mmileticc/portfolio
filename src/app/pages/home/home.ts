import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../content/projects';
import { POSTS } from '../../content/generated/posts';
import { SeoService } from '../../core/seo.service';
import { formatDate } from '../../core/format';
import { Cable } from '../../ui/cable/cable';
import { Pedal } from '../../ui/pedal/pedal';
import { NowPlaying } from './now-playing';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Pedal, Cable, NowPlaying],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  protected readonly projects = PROJECTS;
  protected readonly latestPost = POSTS[0];
  protected readonly formatDate = formatDate;

  constructor() {
    inject(SeoService).set({ path: '/' });
  }
}

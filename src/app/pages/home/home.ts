import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FEATURED } from '../../content/projects';
import { POSTS } from '../../content/generated/posts';
import { SeoService } from '../../core/seo.service';
import { formatDate } from '../../core/format';
import { TunerService } from '../../features/tuner/tuner.service';
import { Song } from '../../ui/song/song';
import { Soundhole } from '../../ui/soundhole/soundhole';
import { Strings } from '../../ui/strings/strings';
import { PracticeLog } from './practice-log';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Song, Soundhole, Strings, PracticeLog],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  protected readonly tuner = inject(TunerService);
  protected readonly featured = FEATURED;
  protected readonly latestPost = POSTS[0];
  protected readonly formatDate = formatDate;
  /** Pages lying slightly askew on a music stand. */
  protected readonly tilts = [-1.5, 1, -0.5, 1.5];

  constructor() {
    inject(SeoService).set({ path: '/' });
  }
}

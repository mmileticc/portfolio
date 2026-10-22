import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { Chord } from '../../ui/chord/chord';
import { Strings } from '../../ui/strings/strings';
import { GITHUB_URL, SITE } from '../../site.config';

interface Track {
  when: string;
  title: string;
  place: string;
  notes?: { name: string; text: string; repo?: string }[];
}

@Component({
  selector: 'app-about',
  imports: [RouterLink, Chord, Strings],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class About {
  protected readonly site = SITE;
  protected readonly githubUrl = GITHUB_URL;

  protected readonly tracks: Track[] = [
    {
      when: 'Now',
      title: "Master's, Software Engineering",
      place: 'School of Electrical Engineering (ETF), University of Belgrade',
    },
    {
      when: 'Completed',
      title: "Bachelor's, Software Engineering",
      place: 'School of Electrical Engineering (ETF), University of Belgrade',
      notes: [
        { name: 'OS1', text: 'a synchronous kernel for RISC-V in C++', repo: 'OS1-project' },
        {
          name: 'Compiler',
          text: 'a compiler for MicroJava, a subset of Java',
          repo: 'Microjava-Compiler',
        },
        { name: 'POOP', text: 'an SQL database management system in C++', repo: 'POOP-project' },
        {
          name: 'IS1',
          text: 'an information system for audio streaming in Java',
          repo: 'IS1-Project',
        },
      ],
    },
  ];

  protected readonly repertoire = [
    { name: 'Languages', items: ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'C++', 'Python'] },
    { name: 'Android', items: ['Jetpack Compose', 'Hilt', 'Room', 'Coroutines & Flow', 'ML Kit'] },
    { name: 'Backend', items: ['Ktor', 'Exposed', 'PostgreSQL', 'JWT', 'FastAPI'] },
    { name: 'Web', items: ['Angular', 'Vue 3', 'Compose for Web', 'SCSS', 'PWA'] },
    { name: 'Data & AI', items: ['Jsoup', 'Playwright', 'Gemini API', 'Supabase'] },
    { name: 'Tooling', items: ['Git', 'GitHub Actions', 'Docker', 'Gradle', 'Cloudflare Workers'] },
  ];

  constructor() {
    inject(SeoService).set({
      path: '/about',
      title: 'About',
      description:
        'About Milinko Miletić: software engineering at ETF Belgrade, favourite tools, and acoustic guitar and harmonica on the side.',
    });
  }
}

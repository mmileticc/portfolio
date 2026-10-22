import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GITHUB_SNAPSHOT } from '../content/generated/github';
import { fetchGithubSnapshot } from '../content/github-api';
import { GithubSnapshot } from '../content/types';
import { SITE } from '../site.config';

const CACHE_KEY = 'github-snapshot';
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Repositories and recent commits. Starts from the snapshot taken at build time (so prerendered
 * pages have real data) and refreshes once per session in the browser. Any API failure, such as
 * the anonymous rate limit, silently keeps the snapshot.
 */
@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly snapshot = signal<GithubSnapshot>(GITHUB_SNAPSHOT);
  private refreshing: Promise<void> | null = null;

  readonly repos = computed(() => this.snapshot().repos);
  readonly commits = computed(() => this.snapshot().commits);
  readonly fetchedAt = computed(() => this.snapshot().fetchedAt);
  /** True once data newer than the build snapshot has arrived. */
  readonly live = signal(false);

  /** Safe to call from many components; only the first call does any work. */
  refresh(): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();
    this.refreshing ??= whenIdle().then(() => this.load());
    return this.refreshing;
  }

  private async load(): Promise<void> {
    const cached = readCache();
    if (cached) {
      this.apply(cached);
      return;
    }
    try {
      const fresh = await fetchGithubSnapshot(SITE.githubUser);
      writeCache(fresh);
      this.apply(fresh);
    } catch {
      // Keep the build-time snapshot.
    }
  }

  private apply(data: GithubSnapshot): void {
    if (data.repos.length === 0) return;
    this.snapshot.set(data);
    this.live.set(true);
  }
}

/** Waits until the browser has a quiet moment, so the refresh never competes with first paint. */
function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => resolve(), { timeout: 2000 });
    else setTimeout(resolve, 200);
  });
}

function readCache(): GithubSnapshot | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GithubSnapshot;
    return Date.now() - Date.parse(data.fetchedAt) < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: GithubSnapshot): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage can be blocked; the data is still shown for this page view.
  }
}

import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'theme';

/**
 * Light/dark theme. Follows the system until the visitor flips the footswitch,
 * after which the choice is remembered.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly systemTheme = signal<Theme>('light');
  private readonly chosen = signal<Theme | null>(null);

  readonly theme = computed<Theme>(() => this.chosen() ?? this.systemTheme());
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    if (!this.isBrowser) return;

    const media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (media) {
      this.systemTheme.set(media.matches ? 'dark' : 'light');
      media.addEventListener('change', (e) => this.systemTheme.set(e.matches ? 'dark' : 'light'));
    }
    this.chosen.set(readStoredTheme());
  }

  toggle(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.chosen.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  }
}

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

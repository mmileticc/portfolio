import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

function mockSystemTheme(dark: boolean): void {
  // jsdom has no matchMedia, so provide one.
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: dark,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList,
  );
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  afterEach(() => vi.unstubAllGlobals());

  it('follows the system theme when nothing was chosen', () => {
    mockSystemTheme(true);
    const theme = TestBed.inject(ThemeService);
    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBeUndefined();
  });

  it('prefers a stored choice over the system theme', () => {
    mockSystemTheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(TestBed.inject(ThemeService).theme()).toBe('light');
  });

  it('toggles, applies and remembers the choice', () => {
    mockSystemTheme(false);
    const theme = TestBed.inject(ThemeService);

    theme.toggle();

    expect(theme.isDark()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('ignores garbage in storage', () => {
    mockSystemTheme(false);
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    expect(TestBed.inject(ThemeService).theme()).toBe('light');
  });
});

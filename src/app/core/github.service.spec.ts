import { TestBed } from '@angular/core/testing';
import { GITHUB_SNAPSHOT } from '../content/generated/github';
import { GithubSnapshot } from '../content/types';
import { GithubService } from './github.service';

const apiRepo = {
  name: 'fresh-repo',
  description: 'Just pushed',
  language: 'Kotlin',
  stargazers_count: 3,
  html_url: 'https://github.com/mmileticc/fresh-repo',
  homepage: '',
  topics: [],
  pushed_at: '2026-10-20T10:00:00Z',
  fork: false,
};

const apiCommit = {
  html_url: 'https://github.com/mmileticc/fresh-repo/commit/abc',
  commit: {
    message: 'Add a thing\n\nLonger body',
    author: { date: '2026-10-20T10:00:00Z' },
    committer: null,
  },
};

function respond(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GithubService', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('starts from the build-time snapshot', () => {
    const github = TestBed.inject(GithubService);
    expect(github.repos()).toEqual(GITHUB_SNAPSHOT.repos);
    expect(github.live()).toBe(false);
  });

  it('switches to live data and caches it for the session', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (input) =>
      String(input).includes('/commits') ? respond([apiCommit]) : respond([apiRepo]),
    );
    const github = TestBed.inject(GithubService);

    await github.refresh();

    expect(github.live()).toBe(true);
    expect(github.repos().map((r) => r.name)).toEqual(['fresh-repo']);
    expect(github.commits()[0].message).toBe('Add a thing');
    expect(JSON.parse(sessionStorage.getItem('github-snapshot')!).repos).toHaveLength(1);
  });

  it('keeps the snapshot when the API fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(respond({ message: 'rate limited' }, 403));
    const github = TestBed.inject(GithubService);

    await github.refresh();

    expect(github.live()).toBe(false);
    expect(github.repos()).toEqual(GITHUB_SNAPSHOT.repos);
  });

  it('uses a fresh session cache without calling the API', async () => {
    const cached: GithubSnapshot = {
      fetchedAt: new Date().toISOString(),
      repos: [
        {
          name: 'cached',
          description: null,
          language: null,
          stars: 0,
          url: '',
          homepage: null,
          topics: [],
          pushedAt: '',
        },
      ],
      commits: [],
    };
    sessionStorage.setItem('github-snapshot', JSON.stringify(cached));
    const fetchSpy = vi.spyOn(window, 'fetch');
    const github = TestBed.inject(GithubService);

    await github.refresh();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(github.repos()[0].name).toBe('cached');
  });
});

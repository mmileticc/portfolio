import type { Commit, GithubSnapshot, Repo } from './types';

/*
 * Shared by the build script (Node, with a token) and GithubService (browser, anonymous),
 * so keep this file free of Angular imports and non-erasable TypeScript.
 */

const API = 'https://api.github.com';
/** How many recently pushed repositories contribute a "now playing" commit. */
const COMMIT_REPOS = 4;

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
}

interface ApiCommit {
  html_url: string;
  commit: { message: string; author: { date: string } | null; committer: { date: string } | null };
}

export function toRepo(r: ApiRepo): Repo {
  return {
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    url: r.html_url,
    homepage: r.homepage || null,
    topics: r.topics ?? [],
    pushedAt: r.pushed_at,
  };
}

export function toCommit(repo: string, c: ApiCommit): Commit {
  const firstLine = c.commit.message.split('\n')[0].trim();
  return {
    repo,
    message: firstLine.length > 90 ? `${firstLine.slice(0, 87)}...` : firstLine,
    url: c.html_url,
    date: c.commit.author?.date ?? c.commit.committer?.date ?? '',
  };
}

export async function fetchGithubSnapshot(
  user: string,
  headers: Record<string, string> = {},
): Promise<GithubSnapshot> {
  const get = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API}${path}`, {
      headers: { Accept: 'application/vnd.github+json', ...headers },
    });
    if (!res.ok) throw new Error(`GitHub ${path} -> HTTP ${res.status}`);
    return (await res.json()) as T;
  };

  const apiRepos = await get<ApiRepo[]>(`/users/${user}/repos?per_page=100&sort=pushed`);
  const repos = apiRepos
    .filter((r) => !r.fork)
    .map(toRepo)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));

  const latest = await Promise.all(
    repos.slice(0, COMMIT_REPOS).map(async (r) => {
      try {
        const commits = await get<ApiCommit[]>(`/repos/${user}/${r.name}/commits?per_page=1`);
        return commits[0] ? toCommit(r.name, commits[0]) : null;
      } catch {
        return null;
      }
    }),
  );

  return {
    fetchedAt: new Date().toISOString(),
    repos,
    commits: latest
      .filter((c): c is Commit => c !== null)
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

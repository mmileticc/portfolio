export interface Post {
  slug: string;
  title: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
  html: string;
}

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  homepage: string | null;
  topics: string[];
  pushedAt: string;
}

export interface Commit {
  repo: string;
  message: string;
  url: string;
  date: string;
}

export interface GithubSnapshot {
  fetchedAt: string;
  repos: Repo[];
  commits: Commit[];
}

import { useEffect, useState } from "react";

export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: string[];
  profileUrl: string;
  lastPush: { repo: string; url: string; at: string } | null;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  pushed_at: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

const CACHE_KEY = "gh-stats-v1";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6h

/**
 * Fetches public GitHub stats (no auth). Caches in sessionStorage and degrades
 * gracefully: on rate-limit or any error it returns null so the UI can hide.
 */
export const useGitHubStats = (username: string) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const cached = (() => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { at: number; data: GitHubStats };
        if (Date.now() - parsed.at < CACHE_TTL && parsed.data.username === username) return parsed.data;
      } catch {
        /* ignore */
      }
      return null;
    })();

    if (cached) {
      // Synchronous hydrate from the session cache on mount — intentional.
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setStats(cached);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("github");
        const user = await userRes.json();
        const repos: GitHubRepo[] = await reposRes.json();

        const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        const langCount = new Map<string, number>();
        repos.forEach((r) => {
          if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
        });
        const topLanguages = [...langCount.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([l]) => l);

        const mostRecentlyPushed = [...repos].sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        )[0];

        const data: GitHubStats = {
          username,
          publicRepos: user.public_repos ?? repos.length,
          followers: user.followers ?? 0,
          totalStars,
          topLanguages,
          profileUrl: user.html_url ?? `https://github.com/${username}`,
          lastPush: mostRecentlyPushed
            ? { repo: mostRecentlyPushed.name, url: mostRecentlyPushed.html_url, at: mostRecentlyPushed.pushed_at }
            : null,
        };
        if (!alive) return;
        setStats(data);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
        } catch {
          /* ignore */
        }
      } catch {
        if (alive) setStats(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [username]);

  return { stats, loading };
};

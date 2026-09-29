/** The only GitHub account useGitHubStats fetches — shared so every
 * consumer of that data (GitHubActivity, ProjectModal) agrees on it. */
export const GH_USERNAME = "krish2105";

/** Coarse "3 days ago"-style relative time — no dependency needed for this. */
export const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

/** Pulls the repo name (lowercased) out of a github.com URL, or null if it
 * doesn't look like one — used to match a project's `repositoryUrl` against
 * `GitHubStats.repoPushDates`. Only matches krish2105-owned repos, since
 * that's the only account useGitHubStats fetches; a project hosted under a
 * different owner (e.g. a team member's repo) has no data to match against
 * and simply shows no "last updated" signal — never a guessed one. */
export const repoNameFromKrish2105Url = (url: string | undefined): string | null => {
  if (!url) return null;
  const m = url.match(/^https?:\/\/github\.com\/krish2105\/([^/]+?)\/?$/i);
  return m ? m[1].toLowerCase() : null;
};

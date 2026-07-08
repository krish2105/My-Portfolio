import { memo } from "react";
import { FaGithub } from "react-icons/fa6";
import { Star, GitFork, Users, Code2 } from "lucide-react";
import { useGitHubStats } from "../../hooks/useGitHubStats";
import { RevealText, Rise } from "../common/Reveal";

const GH_USERNAME = "krish2105";

/** Coarse "3 days ago"-style relative time — no dependency needed for this. */
const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const Stat = ({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Star;
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-col gap-2 bg-[var(--panel)] p-6 transition-colors hover:bg-[var(--panel-2)]">
    <Icon size={18} className="text-[var(--accent)]" aria-hidden />
    <span className="font-display text-3xl font-black leading-none text-[var(--text)] md:text-4xl">{value}</span>
    <span className="text-xs text-[var(--text-3)]">{label}</span>
  </div>
);

const GitHubActivity = () => {
  const { stats, loading } = useGitHubStats(GH_USERNAME);

  // Hide the whole section if GitHub is unreachable / rate-limited.
  if (!loading && !stats) return null;

  return (
    <section
      id="github"
      className="relative border-t border-[var(--border)] px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="mb-12 flex items-center gap-4">
        <span className="kicker">/ Live</span>
        <RevealText className="kicker">Open-source activity</RevealText>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse bg-[var(--panel)]" />
          ))}
        </div>
      ) : (
        stats && (
          <Rise>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
              <Stat icon={GitFork} value={stats.publicRepos} label="Public repositories" />
              <Stat icon={Star} value={stats.totalStars} label="Total stars" />
              <Stat icon={Users} value={stats.followers} label="Followers" />
              <Stat icon={Code2} value={stats.topLanguages[0] ?? "—"} label="Top language" />
            </div>

            {stats.lastPush && (
              <p className="mt-6 flex items-center gap-2 text-sm text-[var(--text-2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
                Last shipped:{" "}
                <a
                  href={stats.lastPush.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--text)] hover:text-[var(--accent)] hover:underline"
                >
                  {stats.lastPush.repo}
                </a>{" "}
                · {relativeTime(stats.lastPush.at)}
              </p>
            )}

            <div className="mt-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex flex-wrap gap-2">
                {stats.topLanguages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-2)]"
                  >
                    {l}
                  </span>
                ))}
              </div>
              <a
                href={stats.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[#00FF94] hover:text-[var(--accent)]"
              >
                <FaGithub size={15} aria-hidden /> View GitHub profile
              </a>
            </div>
            <p className="mt-4 font-mono text-[11px] text-[var(--text-3)]">Live from the GitHub API · cached for 6h.</p>
          </Rise>
        )
      )}
    </section>
  );
};

export default memo(GitHubActivity);

import { useLiveStatus } from "../../hooks/useLiveStatus";

const COPY: Record<string, { dot: string; label: string }> = {
  checking: { dot: "bg-[var(--text-3)]", label: "Checking…" },
  live: { dot: "bg-[#00FF94]", label: "Live" },
  waking: { dot: "bg-[#f5b942]", label: "Waking up (~20–30s)" },
  unreachable: { dot: "bg-[#ff6b6b]", label: "Currently unreachable" },
};

/**
 * Honest reachability ping for a live flagship demo — reinforces these are
 * real running systems (not screenshots), and sets expectations before a
 * recruiter clicks through to a free-tier backend that may be cold-started.
 */
const LiveStatusBadge = ({ url }: { url: string }) => {
  const status = useLiveStatus(url);
  const { dot, label } = COPY[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)]/60 px-2.5 py-1 text-[10px] font-medium text-[var(--text-2)] backdrop-blur"
      role="status"
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot} ${status === "checking" ? "motion-safe:animate-pulse" : ""}`} />
      {label}
    </span>
  );
};

export default LiveStatusBadge;

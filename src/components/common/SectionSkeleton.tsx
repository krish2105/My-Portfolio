/**
 * Suspense fallback for lazy-loaded sections. Reserves roughly the space
 * the real section will take so the chunk loading in doesn't cause a
 * layout shift while the visitor is scrolling. `motion-safe:animate-pulse`
 * already no-ops under prefers-reduced-motion (no extra check needed).
 */
const BAR = "rounded-lg bg-[var(--panel)] motion-safe:animate-pulse";

const SectionSkeleton = ({ variant = "compact" }: { variant?: "compact" | "tall" }) => (
  <div
    aria-hidden="true"
    className="border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40"
  >
    <div data-testid="skeleton-block" className={`${BAR} mb-6 h-4 w-24`} />
    <div data-testid="skeleton-block" className={`${BAR} mb-10 h-10 w-2/3 max-w-xl`} />
    <div className={`grid gap-4 ${variant === "tall" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
      {Array.from({ length: variant === "tall" ? 2 : 3 }).map((_, i) => (
        <div key={i} data-testid="skeleton-block" className={`${BAR} ${variant === "tall" ? "h-64" : "h-40"}`} />
      ))}
    </div>
  </div>
);

export default SectionSkeleton;

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import type { ArchitectureStep } from "../../types/portfolio";

/**
 * Renders the project's system flow as an ordered chain of telemetry-style
 * nodes. Semantic markup (an <ol> of real buttons) rather than an <svg> or a
 * diagramming library — screen readers get the step order for free, it
 * reflows to a vertical stack on narrow viewports with no layout math, and
 * no new dependency. Clicking/focusing a node reveals its `detail` (the
 * engineering reasoning behind that stage) in a shared panel below —
 * interactive without hiding anything real.
 */
const ArchitectureMap = ({ steps }: { steps: ArchitectureStep[] }) => {
  const [active, setActive] = useState<number | null>(null);
  const activeStep = active !== null ? steps[active] : null;
  const hasDetails = steps.some((s) => s.detail);

  return (
    <div>
      <ol className="relative flex flex-col gap-2 md:flex-row md:flex-wrap md:items-stretch md:gap-0">
        {/* Connecting rail — purely decorative, sits behind the node row on desktop. */}
        {steps.length > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#00FF94]/25 to-transparent md:block"
          />
        )}
        {steps.map((step, i) => {
          const isActive = active === i;
          return (
            <li key={step.label} className="flex items-center gap-2 md:contents">
              <button
                type="button"
                disabled={!step.detail}
                aria-expanded={step.detail ? isActive : undefined}
                onClick={() => setActive((prev) => (prev === i ? null : i))}
                className={`relative flex min-h-[64px] flex-1 flex-col justify-center gap-0.5 rounded-lg border px-4 py-3 text-left transition-colors md:min-w-[140px] ${
                  isActive
                    ? "border-[#00FF94] bg-[#00FF94]/[0.08]"
                    : "border-[var(--border)] bg-[var(--panel)]"
                } ${step.detail ? "cursor-pointer hover:border-[#00FF94]/50" : "cursor-default"}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.detail && (
                    <Info
                      size={12}
                      aria-hidden
                      className={`transition-colors ${isActive ? "text-[var(--accent)]" : "text-[var(--text-3)]"}`}
                    />
                  )}
                </span>
                <span className="text-[13px] font-medium leading-snug text-[var(--text)]">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  size={16}
                  className="hidden shrink-0 text-[var(--text-3)] md:mx-1.5 md:block"
                />
              )}
            </li>
          );
        })}
      </ol>

      {hasDetails && (
        <AnimatePresence mode="wait">
          {activeStep?.detail ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-3 rounded-lg border border-[#00FF94]/25 bg-[#00FF94]/[0.05] p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                {String((active ?? 0) + 1).padStart(2, "0")} · {activeStep.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-2)]">{activeStep.detail}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 text-xs text-[var(--text-3)]"
            >
              Select a stage above to see the engineering reasoning behind it.
            </motion.p>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ArchitectureMap;

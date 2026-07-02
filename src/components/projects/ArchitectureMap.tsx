import { ArrowRight } from "lucide-react";
import type { ArchitectureStep } from "../../types/portfolio";

/**
 * Renders the project's system flow as an ordered chain of telemetry-style
 * nodes. Plain semantic markup (an <ol> of real text) rather than an <svg> —
 * screen readers get the step order for free, and it reflows to a vertical
 * stack on narrow viewports without any layout math.
 */
const ArchitectureMap = ({ steps }: { steps: ArchitectureStep[] }) => (
  <ol className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-stretch md:gap-0">
    {steps.map((step, i) => (
      <li key={step.label} className="flex items-center gap-2 md:contents">
        <div className="flex min-h-[64px] flex-1 flex-col justify-center gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-3 md:min-w-[140px]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-medium leading-snug text-[var(--text)]">{step.label}</span>
          {step.detail && <span className="text-[11px] leading-snug text-[var(--text-3)]">{step.detail}</span>}
        </div>
        {i < steps.length - 1 && (
          <ArrowRight
            aria-hidden
            size={16}
            className="hidden shrink-0 text-[var(--text-3)] md:mx-1.5 md:block"
          />
        )}
      </li>
    ))}
  </ol>
);

export default ArchitectureMap;

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CapabilityGroup } from "../../types/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * An interactive radial map of capability groups (hubs) and their core
 * skills (satellites, revealed on click/focus). Desktop-only enhancement —
 * `CapabilitiesSection`'s existing card grid below remains the complete,
 * always-visible source of truth (mobile users and anyone who prefers not
 * to use this get the full list there, so nothing is map-only).
 *
 * Deliberately plain HTML buttons + one decorative `aria-hidden` SVG for the
 * connector lines, not R3F/canvas — every node is a real, keyboard-reachable
 * control, and it costs ~0 extra bundle weight next to the existing (already
 * heavy) 3D hero chunk.
 */
const SkillConstellation = ({ groups }: { groups: CapabilityGroup[] }) => {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState<string | null>(groups[0]?.id ?? null);

  const n = groups.length;
  const HUB_RADIUS = 34;
  const hubPos = (i: number) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: 50 + HUB_RADIUS * Math.cos(angle), y: 50 + HUB_RADIUS * Math.sin(angle) };
  };

  const activeGroup = groups.find((g) => g.id === active);
  const activeIndex = groups.findIndex((g) => g.id === active);
  const activeCore = activeGroup?.skills.filter((s) => s.level === "Core").slice(0, 6) ?? [];
  const SAT_RADIUS = 16;
  const satPos = (hub: { x: number; y: number }, i: number, total: number) => {
    const spread = Math.PI * 0.8;
    const angle = -spread / 2 + (i / Math.max(total - 1, 1)) * spread + (activeIndex / n) * 2 * Math.PI - Math.PI / 2;
    return { x: hub.x + SAT_RADIUS * Math.cos(angle), y: hub.y + SAT_RADIUS * Math.sin(angle) };
  };

  return (
    <div
      role="group"
      aria-label="Interactive skill map — select a capability group to see its core skills"
      className="relative mb-10 hidden aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] lg:block"
    >
      <svg aria-hidden viewBox="0 0 100 56.25" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {groups.map((g, i) => {
          const hub = hubPos(i);
          return (
            <line
              key={g.id}
              x1={50}
              y1={28.125}
              x2={hub.x}
              y2={hub.y * 0.5625}
              stroke="var(--border-strong)"
              strokeWidth={0.2}
            />
          );
        })}
        {activeGroup &&
          activeCore.map((s, i) => {
            const hub = hubPos(activeIndex);
            const sat = satPos(hub, i, activeCore.length);
            return (
              <line
                key={s.name}
                x1={hub.x}
                y1={hub.y * 0.5625}
                x2={sat.x}
                y2={sat.y * 0.5625}
                stroke="#00FF94"
                strokeOpacity={0.4}
                strokeWidth={0.2}
              />
            );
          })}
      </svg>

      {/* Center node */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#00FF94]/40 bg-[var(--panel-2)] font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]"
      >
        Skills
      </div>

      {/* Hub nodes */}
      {groups.map((g, i) => {
        const pos = hubPos(i);
        const isActive = g.id === active;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => setActive(isActive ? null : g.id)}
            aria-expanded={isActive}
            aria-controls={`constellation-${g.id}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible-ring ${
              isActive
                ? "border-[#00FF94] bg-[#00FF94]/15 text-[var(--accent)]"
                : "border-[var(--border-strong)] bg-[var(--panel-2)] text-[var(--text-2)] hover:border-[#00FF94]/40 hover:text-[var(--text)]"
            }`}
          >
            {g.title}
          </button>
        );
      })}

      {/* Satellite skill nodes for the active hub */}
      <AnimatePresence>
        {activeGroup &&
          activeCore.map((s, i) => {
            const hub = hubPos(activeIndex);
            const pos = satPos(hub, i, activeCore.length);
            return (
              <motion.span
                key={s.name}
                id={i === 0 ? `constellation-${activeGroup.id}` : undefined}
                initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2, delay: reduced ? 0 : i * 0.03 }}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[#00FF94]/30 bg-[var(--bg)]/80 px-2.5 py-1 font-mono text-[10px] text-[var(--accent)] backdrop-blur"
              >
                {s.name}
              </motion.span>
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default SkillConstellation;

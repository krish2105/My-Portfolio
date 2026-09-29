import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

const SECTIONS = [
  { id: "hero", label: "01" },
  { id: "about", label: "02" },
  { id: "journey", label: "03" },
  { id: "skills", label: "04" },
  { id: "projects", label: "05" },
  { id: "trust", label: "06" },
  { id: "demo", label: "07" },
  { id: "resume", label: "08" },
  { id: "contact", label: "09" },
];

export const ScrollTelemetryRail = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("01");
  const [fps, setFps] = useState(60);

  // Monitor scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const p = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100));
        setScrollProgress(p);
      }

      // Determine active section based on scroll offset
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id) || (SECTIONS[i].id === "hero" ? document.getElementById("home") : null);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(SECTIONS[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time FPS monitor (only on desktop where rail is visible)
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1280) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(120, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id) || (id === "hero" ? document.getElementById("home") : null);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Scroll progress and section index"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 select-none"
    >
      {/* Telemetry pill */}
      <div className="rounded-full border border-[var(--border)] bg-[var(--panel)]/80 backdrop-blur-md px-2 py-1 font-mono text-[10px] text-[var(--text-3)] flex items-center gap-1 shadow-lg">
        <Activity size={10} className="text-[var(--accent)] animate-pulse" />
        <span className="font-semibold text-[var(--accent)]">{fps}</span>
        <span className="opacity-50">FPS</span>
      </div>

      {/* Progress track */}
      <div className="relative w-1.5 h-36 rounded-full bg-[var(--border)] overflow-hidden my-1">
        <div
          className="w-full bg-[var(--accent)] rounded-full transition-all duration-150"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Current section index */}
      <div className="flex flex-col items-center gap-1 font-mono text-[10px]">
        <span className="font-bold text-[var(--accent)]">({activeSection})</span>
        <span className="text-[9px] text-[var(--text-3)] opacity-60">/ 09</span>
      </div>

      {/* Quick jump dots */}
      <div className="flex flex-col gap-1.5 mt-1">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollTo(sec.id)}
            title={`Jump to section ${sec.label}`}
            aria-label={`Jump to section ${sec.label}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSection === sec.label
                ? "w-4 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                : "w-1.5 bg-[var(--border-strong)] hover:bg-[var(--text-3)]"
            }`}
          />
        ))}
      </div>
    </nav>
  );
};

export default ScrollTelemetryRail;

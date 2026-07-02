import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";
import { NAV_ITEMS as navItems, SECTION_IDS } from "../../data/nav";
import ThemeToggle from "../common/ThemeToggle";
import SoundToggle from "../common/SoundToggle";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(`#${id}`, lenis);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--border)] bg-[var(--bg)]/70 py-3 backdrop-blur-xl" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-[8vw]">
        <a href="#home" onClick={go("home")} className="font-display text-lg font-black tracking-tighter text-[var(--text)] focus-visible-ring" aria-label="Home">
          KM<span className="text-[var(--accent)]">.</span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--panel)]/60 px-2 py-1 backdrop-blur md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={go(item.id)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeId === item.id ? "text-[#050505]" : "text-[var(--text-2)] hover:text-[var(--text)]"
              }`}
            >
              {activeId === item.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[#00FF94]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <SoundToggle />
          <ThemeToggle />
          <a
            href="#contact"
            onClick={go("contact")}
            className="rounded-full border border-[var(--border-strong)] px-5 py-2 text-sm font-bold text-[var(--text)] transition-colors hover:border-[#00FF94] hover:text-[var(--accent)]"
          >
            Let's talk
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <SoundToggle />
          <ThemeToggle />
          <MobileMenu navItems={navItems} activeId={activeId} />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

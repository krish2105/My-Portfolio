import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { profile } from "../../data/portfolio";
import SocialLinks from "../common/SocialLinks";
import ResumeButton from "../common/ResumeButton";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";

interface MobileMenuProps {
  navItems: { id: string; label: string }[];
  activeId: string;
}

const MobileMenu = ({ navItems, activeId }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible-ring"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu size={28} />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-[var(--bg)]/95 backdrop-blur-md flex flex-col justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible-ring"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-8">
              <span className="text-xl font-bold tracking-widest text-[var(--text)] mb-4 uppercase font-display">
                {profile.name}
              </span>
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setTimeout(() => scrollTo(`#${item.id}`, lenis), 50);
                  }}
                  className={`text-2xl font-medium tracking-wide transition-colors ${
                    activeId === item.id ? "text-gradient" : "text-[var(--text-2)] hover:text-[var(--text)]"
                  } focus-visible-ring`}
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-6 flex flex-col items-center gap-6">
                <ResumeButton variant="solid" label="Download Resume" />
                <SocialLinks />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MobileMenu;

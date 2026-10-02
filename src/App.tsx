import { useEffect, useState, lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/common/ErrorBoundary";
import SkipLink from "./components/common/SkipLink";
import SmoothScroll from "./lib/SmoothScroll";
import Cursor from "./components/common/Cursor";
import ScrollProgress from "./components/common/ScrollProgress";
import CommandPalette from "./components/common/CommandPalette";
import UsesModal from "./components/common/UsesModal";
import EasterEgg from "./components/common/EasterEgg";
import CyberTerminal from "./components/common/CyberTerminal";
import ScrollTelemetryRail from "./components/common/ScrollTelemetryRail";
import { SITE_TITLE } from "./data/site";
import { useCommandPalette } from "./hooks/useCommandPalette";
import { useOffscreenAnimationPause } from "./hooks/useOffscreenAnimationPause";
import Preloader from "./components/common/Preloader";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageSections from "./components/layout/PageSections";

// Unlisted personal-use view (?mode=interview) — never needed by a real
// visitor, so it must never cost anything in the main bundle.
const InterviewPrepView = lazy(() => import("./components/InterviewPrepView"));

const DEFAULT_TITLE = SITE_TITLE;

const App = () => {
  const [ready, setReady] = useState(false);
  const palette = useCommandPalette();
  const [usesOpen, setUsesOpen] = useState(false);
  const [partyActive, setPartyActive] = useState(false);
  useOffscreenAnimationPause();

  const triggerEasterEgg = () => {
    setPartyActive(true);
    setTimeout(() => setPartyActive(false), 1600);
  };

  const openUses = () => {
    setUsesOpen(true);
    if (window.location.pathname !== "/uses") window.history.pushState({ uses: true }, "", "/uses");
  };
  const closeUses = () => {
    setUsesOpen(false);
    document.title = DEFAULT_TITLE;
    if (window.location.pathname === "/uses") window.history.pushState({}, "", "/");
  };

  useEffect(() => {
    const sync = () => setUsesOpen(window.location.pathname === "/uses");
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Unlisted personal prep sheet — checked once, not a route change a real
  // visitor would ever trigger, so no popstate sync needed like /uses above.
  if (new URLSearchParams(window.location.search).get("mode") === "interview") {
    return (
      <Suspense fallback={null}>
        <InterviewPrepView />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="p-8 text-white">Something went wrong. Please refresh the page.</div>}>
      <Preloader onDone={() => setReady(true)} />

      <SmoothScroll>
        <Cursor />
        <ScrollProgress />
        <CyberTerminal />
        <ScrollTelemetryRail />
        <CommandPalette
          open={palette.open}
          onClose={() => palette.setOpen(false)}
          onOpenUses={openUses}
          onEasterEgg={triggerEasterEgg}
        />
        <UsesModal open={usesOpen} onClose={closeUses} />
        <EasterEgg active={partyActive} />
        <div className="grain relative">
          <SkipLink />
          <Navbar />

          <PageSections />

          <Footer />
        </div>
      </SmoothScroll>

      {/* Real-user Core Web Vitals + page/event analytics (no-op locally; reports on Vercel) */}
      <SpeedInsights />
      <Analytics />

      {/* `ready` gates nothing visually beyond the preloader, but keeps the
          intro mounted until the sequence finishes. */}
      {!ready && null}
    </ErrorBoundary>
  );
};

export default App;

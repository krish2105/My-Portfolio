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
import Assistant from "./components/assistant/Assistant";
import { useCommandPalette } from "./hooks/useCommandPalette";
import Preloader from "./components/common/Preloader";
import SectionSkeleton from "./components/common/SectionSkeleton";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/hero/HeroSection";
import TechnologyMarquee from "./components/sections/TechnologyMarquee";
import AboutSection from "./components/sections/AboutSection";
import BentoSection from "./components/sections/BentoSection";
import WhatIDoSection from "./components/sections/WhatIDoSection";
import JourneySection from "./components/sections/JourneySection";
import CapabilitiesSection from "./components/sections/CapabilitiesSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import ContactSection from "./components/sections/ContactSection";

// Below-the-fold sections: not needed for first paint, so split into their
// own chunks to shrink the main bundle and cut initial parse/hydrate work
// (2026-07-08 perf audit — App.tsx previously imported all 18 sections
// eagerly with no code-splitting beyond the R3F hero).
const GitHubActivity = lazy(() => import("./components/sections/GitHubActivity"));
const LiveDemo = lazy(() => import("./components/sections/LiveDemo"));
const RecognitionSection = lazy(() => import("./components/sections/RecognitionSection"));
const TrustAndThinkingSection = lazy(() => import("./components/sections/trust/TrustAndThinkingSection"));
const ResumeSection = lazy(() => import("./components/sections/ResumeSection"));
// Unlisted personal-use view (?mode=interview) — never needed by a real
// visitor, so it must never cost anything in the main bundle.
const InterviewPrepView = lazy(() => import("./components/InterviewPrepView"));

const DEFAULT_TITLE = "Krishna Mathur — AI Developer building decision tools from data, language & workflows";

const App = () => {
  const [ready, setReady] = useState(false);
  const palette = useCommandPalette();
  const [usesOpen, setUsesOpen] = useState(false);
  const [partyActive, setPartyActive] = useState(false);

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

          <main id="main-content">
            <HeroSection />
            <BentoSection />
            <TechnologyMarquee />
            <AboutSection />
            <WhatIDoSection />
            <JourneySection />
            <CapabilitiesSection />
            <ProjectsSection />
            <Suspense fallback={<SectionSkeleton variant="compact" />}>
              <GitHubActivity />
            </Suspense>
            <Suspense fallback={<SectionSkeleton variant="tall" />}>
              <LiveDemo />
            </Suspense>
            <Suspense fallback={<SectionSkeleton variant="compact" />}>
              <RecognitionSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton variant="tall" />}>
              <TrustAndThinkingSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton variant="tall" />}>
              <ResumeSection />
            </Suspense>
            <ContactSection />
            {/* Fixed-position; lives in <main> only so it's reachable via landmark navigation. */}
            <Assistant />
          </main>

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

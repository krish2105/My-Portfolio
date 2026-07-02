import { useEffect, useState } from "react";
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
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/hero/HeroSection";
import TechnologyMarquee from "./components/sections/TechnologyMarquee";
import AboutSection from "./components/sections/AboutSection";
import BentoSection from "./components/sections/BentoSection";
import WhatIDoSection from "./components/sections/WhatIDoSection";
import JourneySection from "./components/sections/JourneySection";
import WritingSection from "./components/sections/WritingSection";
import CapabilitiesSection from "./components/sections/CapabilitiesSection";
import GitHubActivity from "./components/sections/GitHubActivity";
import LiveDemo from "./components/sections/LiveDemo";
import ProjectsSection from "./components/sections/ProjectsSection";
import RecognitionSection from "./components/sections/RecognitionSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ResumeSection from "./components/sections/ResumeSection";
import ContactSection from "./components/sections/ContactSection";

const DEFAULT_TITLE = "Krishna Mathur — AI Developer, Data Analyst & GenAI Builder";

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
            <TechnologyMarquee />
            <AboutSection />
            <BentoSection />
            <WhatIDoSection />
            <JourneySection />
            <WritingSection />
            <CapabilitiesSection />
            <GitHubActivity />
            <LiveDemo />
            <ProjectsSection />
            <RecognitionSection />
            <TestimonialsSection />
            <ResumeSection />
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

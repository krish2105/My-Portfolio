import { useState } from "react";
import ErrorBoundary from "./components/common/ErrorBoundary";
import SkipLink from "./components/common/SkipLink";
import SmoothScroll from "./lib/SmoothScroll";
import Cursor from "./components/common/Cursor";
import Preloader from "./components/common/Preloader";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/hero/HeroSection";
import TechnologyMarquee from "./components/sections/TechnologyMarquee";
import AboutSection from "./components/sections/AboutSection";
import WhatIDoSection from "./components/sections/WhatIDoSection";
import JourneySection from "./components/sections/JourneySection";
import CapabilitiesSection from "./components/sections/CapabilitiesSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import RecognitionSection from "./components/sections/RecognitionSection";
import ResumeSection from "./components/sections/ResumeSection";
import ContactSection from "./components/sections/ContactSection";

const App = () => {
  const [ready, setReady] = useState(false);

  return (
    <ErrorBoundary fallback={<div className="p-8 text-white">Something went wrong. Please refresh the page.</div>}>
      <Preloader onDone={() => setReady(true)} />

      <SmoothScroll>
        <Cursor />
        <div className="grain relative">
          <SkipLink />
          <Navbar />

          <main id="main-content">
            <HeroSection />
            <TechnologyMarquee />
            <AboutSection />
            <WhatIDoSection />
            <JourneySection />
            <CapabilitiesSection />
            <ProjectsSection />
            <RecognitionSection />
            <ResumeSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      </SmoothScroll>

      {/* `ready` gates nothing visually beyond the preloader, but keeps the
          intro mounted until the sequence finishes. */}
      {!ready && null}
    </ErrorBoundary>
  );
};

export default App;

import { Fragment, Suspense, lazy, useEffect, useRef, type ReactNode } from "react";
import { usePageLayout } from "../../hooks/usePageLayout";
import { useSmoothScroll } from "../../lib/SmoothScroll";
import type { SectionKey } from "../../lib/pageLayout";
import type { ViewMode } from "../../lib/viewModeTypes";
import Assistant from "../assistant/Assistant";
import SectionSkeleton from "../common/SectionSkeleton";
import HeroSection from "../hero/HeroSection";
import AboutSection from "../sections/AboutSection";
import BentoSection from "../sections/BentoSection";
import CapabilitiesSection from "../sections/CapabilitiesSection";
import ContactSection from "../sections/ContactSection";
import JourneySection from "../sections/JourneySection";
import ProjectsSection from "../sections/ProjectsSection";
import TechnologyMarquee from "../sections/TechnologyMarquee";

// Below-the-fold sections are split into their own chunks (not needed for first paint).
const GitHubActivity = lazy(() => import("../sections/GitHubActivity"));
const LiveDemo = lazy(() => import("../sections/LiveDemo"));
const CredentialsSection = lazy(() => import("../sections/credentials/CredentialsSection"));
const ResumeSection = lazy(() => import("../sections/ResumeSection"));

const renderSection = (key: SectionKey, mode: ViewMode): ReactNode => {
  switch (key) {
    case "home":
      return <HeroSection />;
    case "projects":
      return <ProjectsSection variant={mode === "recruiter" ? "strip" : "gallery"} />;
    case "snapshot":
      return <BentoSection />;
    case "marquee":
      return <TechnologyMarquee />;
    case "about":
      return <AboutSection />;
    case "journey":
      return <JourneySection />;
    case "skills":
      return <CapabilitiesSection />;
    case "github":
      return (
        <Suspense fallback={<SectionSkeleton variant="compact" />}>
          <GitHubActivity />
        </Suspense>
      );
    case "demo":
      return (
        <Suspense fallback={<SectionSkeleton variant="tall" />}>
          <LiveDemo />
        </Suspense>
      );
    case "credentials":
      return (
        <Suspense fallback={<SectionSkeleton variant="compact" />}>
          <CredentialsSection />
        </Suspense>
      );
    case "resume":
      return (
        <Suspense fallback={<SectionSkeleton variant="tall" />}>
          <ResumeSection />
        </Suspense>
      );
    case "contact":
      return <ContactSection />;
  }
};

/**
 * <main>: renders exactly the sections the layout table says belong on the page for the current audience. Switching
 * audience swaps the content below the fold, so it also returns to the top rather than leaving the visitor mid-page in
 * content that no longer exists.
 */
const PageSections = () => {
  const { sections, mode } = usePageLayout();
  const { lenis } = useSmoothScroll();
  const previousMode = useRef(mode);

  useEffect(() => {
    if (previousMode.current === mode) return;
    previousMode.current = mode;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [mode, lenis]);

  return (
    <main id="main-content">
      {sections.map((key) => (
        <Fragment key={key}>{renderSection(key, mode)}</Fragment>
      ))}
      {/* Fixed-position; lives in <main> only so it's reachable via landmark navigation. */}
      <Assistant />
    </main>
  );
};

export default PageSections;

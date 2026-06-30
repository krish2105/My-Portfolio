import { Suspense, lazy, useEffect, useRef, useState } from "react";
import NameNeurons from "./NameNeurons";
import ErrorBoundary from "../common/ErrorBoundary";
import { useWebGLSupport } from "../../hooks/useWebGLSupport";

// Heavy Three.js scene is code-split into its own chunk so it never blocks LCP.
const NeuralGraphR3F = lazy(() => import("./NeuralGraphR3F"));

/**
 * Chooses the hero backdrop:
 *  • Capable device (WebGL, fine pointer, no reduced-motion) → lazy R3F neural graph.
 *  • Otherwise → the lightweight Canvas 2D neuron field (NameNeurons).
 * The WebGL scene is unmounted once the hero leaves the viewport so it does no
 * GPU work while the user reads the rest of the page.
 */
const HeroBackdrop = () => {
  const webgl = useWebGLSupport();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {webgl && inView ? (
        <ErrorBoundary fallback={<NameNeurons />}>
          <Suspense fallback={<NameNeurons />}>
            <NeuralGraphR3F />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <NameNeurons />
      )}
    </div>
  );
};

export default HeroBackdrop;

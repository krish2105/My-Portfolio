import { Suspense, lazy } from "react";
import NeuralFallback from "./NeuralFallback";
import ErrorBoundary from "../common/ErrorBoundary";
import { useWebGLSupport } from "../../hooks/useWebGLSupport";

// Lazy load the 3D scene so it doesn't block initial render
const NeuralScene = lazy(() => import("./NeuralScene"));

const HeroVisual = () => {
  const isWebGLSupported = useWebGLSupport();

  // If WebGL is not supported, just render the CSS fallback immediately
  if (!isWebGLSupported) {
    return <NeuralFallback />;
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0A0A0A]">
      <ErrorBoundary fallback={<NeuralFallback />}>
        <Suspense fallback={<NeuralFallback />}>
          <NeuralScene />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HeroVisual;

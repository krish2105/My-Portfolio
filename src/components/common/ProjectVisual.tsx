interface ProjectVisualProps {
  type?: string;
  className?: string;
}

const ProjectVisual = ({ type, className = "" }: ProjectVisualProps) => {
  // A generic fallback visual if type is unknown
  const FallbackVisual = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full object-cover opacity-80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(215,226,234,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <circle cx="200" cy="150" r="60" fill="none" stroke="rgba(0, 255, 148, 0.2)" strokeWidth="2" />
      <circle cx="200" cy="150" r="30" fill="none" stroke="rgba(0, 255, 148, 0.3)" strokeWidth="1" />
    </svg>
  );

  const renderVisual = () => {
    switch (type) {
      case "smartloanbot":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            {/* Chat Bubbles */}
            <rect x="50" y="80" width="160" height="40" rx="8" fill="rgba(0, 255, 148, 0.1)" stroke="#00FF94" strokeWidth="1"/>
            <rect x="190" y="140" width="160" height="40" rx="8" fill="rgba(0, 255, 148, 0.1)" stroke="#00FF94" strokeWidth="1"/>
            <rect x="50" y="200" width="140" height="40" rx="8" fill="rgba(0, 255, 148, 0.1)" stroke="#00FF94" strokeWidth="1"/>
            {/* Nodes */}
            <circle cx="130" cy="100" r="4" fill="#00FF94" />
            <circle cx="270" cy="160" r="4" fill="#00FF94" />
            <circle cx="120" cy="220" r="4" fill="#00FF94" />
          </svg>
        );
      case "waselx":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            {/* Network graph */}
            <path d="M100 150 L200 80 L300 150 L200 220 Z" fill="none" stroke="rgba(0, 255, 148, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M100 150 L200 150 L300 150" fill="none" stroke="#00FF94" strokeWidth="2" />
            <path d="M200 80 L200 220" fill="none" stroke="rgba(215, 226, 234, 0.1)" strokeWidth="1" />
            <circle cx="100" cy="150" r="6" fill="#111111" stroke="#00FF94" strokeWidth="2"/>
            <circle cx="200" cy="80" r="8" fill="#111111" stroke="#00FF94" strokeWidth="2"/>
            <circle cx="300" cy="150" r="6" fill="#111111" stroke="#00FF94" strokeWidth="2"/>
            <circle cx="200" cy="220" r="6" fill="#111111" stroke="#00FF94" strokeWidth="2"/>
            <circle cx="200" cy="150" r="10" fill="#00FF94" />
          </svg>
        );
      case "flower":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            {/* CNN Grid */}
            <rect x="60" y="100" width="80" height="100" fill="none" stroke="rgba(215, 226, 234, 0.2)" strokeWidth="1" />
            <rect x="70" y="110" width="80" height="100" fill="rgba(0, 255, 148, 0.1)" stroke="#00FF94" strokeWidth="1" />
            <path d="M 170 160 L 230 160" fill="none" stroke="#00FF94" strokeWidth="2" strokeDasharray="4 4"/>
            {/* Probability Bars */}
            <rect x="250" y="110" width="90" height="12" fill="rgba(0, 255, 148, 0.8)" />
            <rect x="250" y="134" width="40" height="12" fill="rgba(215, 226, 234, 0.3)" />
            <rect x="250" y="158" width="20" height="12" fill="rgba(215, 226, 234, 0.3)" />
            <rect x="250" y="182" width="10" height="12" fill="rgba(215, 226, 234, 0.3)" />
          </svg>
        );
      case "talktodata":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            {/* Database cylinder */}
            <ellipse cx="200" cy="220" rx="60" ry="20" fill="none" stroke="#00FF94" strokeWidth="2" />
            <path d="M 140 220 L 140 250 A 60 20 0 0 0 260 250 L 260 220" fill="rgba(0, 255, 148, 0.1)" stroke="#00FF94" strokeWidth="2" />
            {/* Query panels */}
            <rect x="70" y="60" width="260" height="30" rx="4" fill="rgba(215, 226, 234, 0.05)" stroke="rgba(215, 226, 234, 0.2)" />
            <rect x="70" y="110" width="80" height="50" rx="4" fill="rgba(215, 226, 234, 0.05)" stroke="rgba(215, 226, 234, 0.2)" />
            <rect x="160" y="110" width="80" height="50" rx="4" fill="rgba(0, 255, 148, 0.1)" stroke="#00FF94" strokeWidth="2" />
            <rect x="250" y="110" width="80" height="50" rx="4" fill="rgba(215, 226, 234, 0.05)" stroke="rgba(215, 226, 234, 0.2)" />
            <path d="M 200 170 L 200 200" fill="none" stroke="#00FF94" strokeWidth="2" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#00FF94" />
              </marker>
            </defs>
          </svg>
        );
      case "electric":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            <path d="M 50 250 L 50 50" fill="none" stroke="rgba(215, 226, 234, 0.2)" strokeWidth="1" />
            <path d="M 50 250 L 350 250" fill="none" stroke="rgba(215, 226, 234, 0.2)" strokeWidth="1" />
            {/* Time-series lines */}
            <path d="M 50 200 Q 100 150 150 180 T 250 120" fill="none" stroke="#A0ADBA" strokeWidth="2" />
            <path d="M 250 120 Q 300 80 350 100" fill="none" stroke="#00FF94" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 250 120 Q 300 100 350 70" fill="none" stroke="#00FF94" strokeWidth="2" strokeDasharray="4 4" />
            {/* Window */}
            <rect x="200" y="80" width="50" height="170" fill="rgba(215, 226, 234, 0.05)" />
          </svg>
        );
      case "mediflow":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            {/* Hospital cross */}
            <rect x="178" y="50" width="44" height="120" rx="6" fill="rgba(0, 255, 148, 0.12)" stroke="#00FF94" strokeWidth="1.5" />
            <rect x="140" y="88" width="120" height="44" rx="6" fill="rgba(0, 255, 148, 0.12)" stroke="#00FF94" strokeWidth="1.5" />
            {/* RL allocation grid */}
            {[0, 1, 2, 3].map((c) =>
              [0, 1].map((r) => (
                <rect
                  key={`${c}-${r}`}
                  x={70 + c * 70}
                  y={200 + r * 35}
                  width="50"
                  height="25"
                  rx="4"
                  fill={(c + r) % 2 === 0 ? "rgba(0, 255, 148, 0.18)" : "rgba(215, 226, 234, 0.05)"}
                  stroke="rgba(215, 226, 234, 0.2)"
                />
              ))
            )}
            <path d="M 95 200 L 95 132" fill="none" stroke="#00FF94" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        );
      case "lulu":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#0A0A0A" />
            <path d="M 50 240 L 350 240" fill="none" stroke="rgba(215, 226, 234, 0.2)" strokeWidth="1" />
            {/* Bar chart */}
            {[120, 80, 160, 110, 190, 140].map((h, i) => (
              <rect
                key={i}
                x={60 + i * 50}
                y={240 - h}
                width="30"
                height={h}
                rx="3"
                fill={i === 4 ? "#00FF94" : "rgba(0, 255, 148, 0.25)"}
              />
            ))}
            {/* Trend line */}
            <path d="M 75 150 L 125 180 L 175 110 L 225 140 L 275 70 L 325 100" fill="none" stroke="#A0ADBA" strokeWidth="2" />
            {[150, 180, 110, 140, 70, 100].map((y, i) => (
              <circle key={i} cx={75 + i * 50} cy={y} r="3" fill="#EDF5FA" />
            ))}
          </svg>
        );
      default:
        return <FallbackVisual />;
    }
  };

  return (
    <div className={`w-full h-full bg-[#0A0A0A] overflow-hidden flex items-center justify-center ${className}`}>
      {renderVisual()}
    </div>
  );
};

export default ProjectVisual;

const NeuralFallback = () => {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      
      {/* Grid lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(215, 226, 234, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(215, 226, 234, 0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Rotating rings (disabled for reduced motion via CSS) */}
      <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
        <div className="absolute inset-0 border border-t-[#00FF94] border-r-transparent border-b-[#00FF94] border-l-transparent rounded-full opacity-30 animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-4 border border-t-transparent border-r-[#00FF94] border-b-transparent border-l-[#00FF94] rounded-full opacity-20 animate-[spin_15s_linear_infinite_reverse]" />
        
        {/* Core monogram */}
        <div className="z-10 text-4xl md:text-6xl font-black text-[#EDF5FA] tracking-tighter opacity-80 drop-shadow-[0_0_15px_rgba(0, 255, 148,0.5)]">
          KM
        </div>
      </div>
    </div>
  );
};

export default NeuralFallback;

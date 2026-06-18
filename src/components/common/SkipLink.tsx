const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="fixed top-0 left-0 p-3 m-3 -translate-y-20 focus:translate-y-0 transition-transform bg-[#111111] text-[#00FF94] z-[100] border border-[rgba(215,226,234,0.14)] focus-visible-ring"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;

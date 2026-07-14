/**
 * Hero section with gradient title and subtitle.
 */
export function HeroSection() {
  return (
    <div className="text-center mb-14 sm:mb-16 max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--tuwa-text-primary)] mb-6 leading-tight font-geist-mono uppercase tracking-tight">
        <span className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] bg-clip-text text-transparent">
          Documentation Hub
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-[var(--tuwa-text-secondary)] leading-relaxed max-w-2xl mx-auto">
        The single entry point to the entire TUWA Web3 ecosystem. Explore documentation for every module in one place —
        from low-level chain primitives to cloud orchestration.
      </p>
    </div>
  );
}

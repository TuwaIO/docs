'use client';

import { useI18n } from '../i18n';

/**
 * Hero section with gradient title and subtitle.
 */
export function HeroSection() {
  const { t } = useI18n();
  return (
    <div className="text-center mb-14 sm:mb-16 max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--tuwa-text-primary)] mb-6 leading-tight font-geist-mono uppercase tracking-tight">
        <span className="bg-gradient-to-r from-[var(--tuwa-hero-gradient-from)] via-[var(--tuwa-hero-gradient-via)] to-[var(--tuwa-hero-gradient-to)] bg-clip-text text-transparent">
          {t.home.hero.titleHighlight}
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-[var(--tuwa-text-secondary)] leading-relaxed max-w-2xl mx-auto">
        {t.home.hero.description}
      </p>
    </div>
  );
}

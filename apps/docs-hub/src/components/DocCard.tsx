import { ArrowTopRightOnSquareIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export interface PackageBadge {
  name: string;
  layer?: string;
  url?: string;
  isDeprecated?: boolean;
}

export interface DocCardProps {
  name: string;
  tagline: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradientFrom: string;
  gradientTo: string;
  docsUrl: string;
  githubUrl: string;
  packages?: PackageBadge[];
}

/**
 * Minimalist card linking to docs and GitHub for a single TUWA module.
 */
export function DocCard({
  name,
  tagline,
  icon: Icon,
  gradientFrom,
  gradientTo,
  docsUrl,
  githubUrl,
  packages,
}: DocCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/30 dark:bg-white/[0.015] backdrop-blur-sm transition-all duration-300 hover:border-[var(--tuwa-text-accent)]/20 hover:bg-[var(--tuwa-bg-primary)]/50 dark:hover:bg-white/[0.03]">
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
      />

      <div className="flex items-center gap-4 p-4 sm:p-5 2xl:p-6">
        {/* Icon badge */}
        <div
          className={`shrink-0 w-10 h-10 2xl:w-12 2xl:h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
        >
          <Icon className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm 2xl:text-base font-semibold text-[var(--tuwa-text-primary)] font-geist-mono uppercase tracking-wide truncate">
            {name}
          </h3>
          <p className="text-xs 2xl:text-sm text-[var(--tuwa-text-secondary)] mt-0.5 truncate">{tagline}</p>
        </div>

        {/* Action icons */}
        <div className="shrink-0 flex items-center gap-2">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Documentation"
            className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-[var(--tuwa-rounded-corners)] flex items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-accent)] hover:bg-[var(--tuwa-text-accent)]/10 transition-all duration-200"
          >
            <BookOpenIcon className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-[var(--tuwa-rounded-corners)] flex items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-text-primary)]/10 transition-all duration-200"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </a>
        </div>
      </div>

      {/* Packages section */}
      {packages && packages.length > 0 && (
        <div className="border-t border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-muted)]/10 dark:bg-black/10 px-4 py-3 sm:px-5 2xl:px-6 2xl:py-4 flex flex-col gap-2 2xl:gap-2.5">
          {packages.map((pkg) => {
            const isNpmPkg = pkg.name.startsWith('@tuwaio/');
            return (
              <a
                key={pkg.name}
                href={pkg.url || `https://www.npmjs.com/package/${pkg.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/badge flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)]/50 dark:bg-white/[0.015] px-3 py-2 2xl:px-4 2xl:py-2.5 text-xs border border-[var(--tuwa-border-primary)]/40 transition-all duration-200 hover:border-[var(--tuwa-text-accent)]/40 hover:bg-[var(--tuwa-bg-primary)]/80"
              >
                {/* Left: Layer badge & Package name */}
                <div className="flex items-center gap-2 min-w-0">
                  {pkg.layer && (
                    <span
                      className={`shrink-0 font-mono text-[9px] 2xl:text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[var(--tuwa-bg-primary)] dark:bg-white/5 border border-[var(--tuwa-border-primary)]/50 bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}
                    >
                      {pkg.layer}
                    </span>
                  )}
                  <span className={`font-mono text-[11px] sm:text-xs 2xl:text-sm font-semibold text-[var(--tuwa-text-primary)] group-hover/badge:text-[var(--tuwa-text-accent)] transition-colors truncate ${pkg.isDeprecated ? 'line-through opacity-60' : ''}`}>
                    {pkg.name}
                  </span>
                  {pkg.isDeprecated && (
                    <span className="shrink-0 text-[9px] 2xl:text-[10px] uppercase font-bold text-red-500/90 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                      Deprecated
                    </span>
                  )}
                </div>

                {/* Right: Clean, aligned badges (Socket, Downloads, Size) */}
                {isNpmPkg && (
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <img
                      src={`https://socket.dev/api/badge/npm/package/${pkg.name}`}
                      alt={`${pkg.name} Socket security score`}
                      className="h-4 2xl:h-4.5 opacity-80 group-hover/badge:opacity-100 transition-opacity rounded-[2px]"
                    />
                    <img
                      src={`https://img.shields.io/npm/dm/${pkg.name}.svg?style=flat-square&colorB=5e6ad2`}
                      alt={`${pkg.name} monthly downloads`}
                      className="h-4 2xl:h-4.5 opacity-80 group-hover/badge:opacity-100 transition-opacity rounded-[2px]"
                    />
                    <img
                      src={`https://img.shields.io/npm/unpacked-size/${pkg.name}?style=flat-square&colorB=3b82f6&label=size`}
                      alt={`${pkg.name} size`}
                      className="h-4 2xl:h-4.5 opacity-80 group-hover/badge:opacity-100 transition-opacity rounded-[2px]"
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

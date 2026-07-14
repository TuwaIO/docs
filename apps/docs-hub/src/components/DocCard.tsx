import { ArrowTopRightOnSquareIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface DocCardProps {
  name: string;
  tagline: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradientFrom: string;
  gradientTo: string;
  docsUrl: string;
  githubUrl: string;
}

/**
 * Minimalist card linking to docs and GitHub for a single TUWA module.
 */
export function DocCard({ name, tagline, icon: Icon, gradientFrom, gradientTo, docsUrl, githubUrl }: DocCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/30 dark:bg-white/[0.015] backdrop-blur-sm transition-all duration-300 hover:border-[var(--tuwa-text-accent)]/20 hover:bg-[var(--tuwa-bg-primary)]/50 dark:hover:bg-white/[0.03]">
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
      />

      <div className="flex items-center gap-4 p-4 sm:p-5">
        {/* Icon badge */}
        <div
          className={`shrink-0 w-10 h-10 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--tuwa-text-primary)] font-geist-mono uppercase tracking-wide truncate">
            {name}
          </h3>
          <p className="text-xs text-[var(--tuwa-text-secondary)] mt-0.5 truncate">{tagline}</p>
        </div>

        {/* Action icons */}
        <div className="shrink-0 flex items-center gap-2">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Documentation"
            className="w-8 h-8 rounded-[var(--tuwa-rounded-corners)] flex items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-accent)] hover:bg-[var(--tuwa-text-accent)]/10 transition-all duration-200"
          >
            <BookOpenIcon className="w-4 h-4" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="w-8 h-8 rounded-[var(--tuwa-rounded-corners)] flex items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-text-primary)]/10 transition-all duration-200"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

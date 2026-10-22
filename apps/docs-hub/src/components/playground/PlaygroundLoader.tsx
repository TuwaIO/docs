'use client';

import dynamic from 'next/dynamic';

function PlaygroundSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the Playground" className="flex flex-col gap-5">
      {/* The controls, the stage and the inspector */}
      {['h-36 sm:h-48', 'h-[600px]', 'h-80'].map((size) => (
        <div
          key={size}
          className={`${size} animate-pulse rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)]/60 dark:bg-white/[0.04]`}
        />
      ))}
    </div>
  );
}

// The TUWA packages of the Playground load in the browser only, on this page only
const PlaygroundStudio = dynamic(() => import('./PlaygroundStudio'), { ssr: false, loading: PlaygroundSkeleton });

/** Loads the Playground in the browser, with a skeleton of its layout meanwhile. */
export function PlaygroundLoader() {
  return <PlaygroundStudio />;
}

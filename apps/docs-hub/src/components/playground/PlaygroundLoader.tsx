'use client';

import dynamic from 'next/dynamic';

function PlaygroundSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading the Playground"
      className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_380px]"
    >
      {['h-64 lg:row-span-2 xl:row-span-1', 'h-[600px]', 'h-80 lg:col-start-2 xl:col-start-auto'].map((size) => (
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

/** Loads the Playground in the browser, with a skeleton of its three columns meanwhile. */
export function PlaygroundLoader() {
  return <PlaygroundStudio />;
}

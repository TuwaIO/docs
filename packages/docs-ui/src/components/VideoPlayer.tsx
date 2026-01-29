'use client';

import { cn } from '@tuwaio/nova-core';
import React from 'react';

/**
 * Props for the VideoPlayer component.
 */
export interface VideoPlayerProps {
  /** Path to the video file in the /public directory */
  src: string;
  /** Optional poster image to display before video plays */
  poster?: string;
  /** Whether the video should autoplay (Note: most browsers require muted for autoplay) */
  autoplay?: boolean;
  /** Whether the video should be muted */
  muted?: boolean;
  /** Whether the video should loop */
  loop?: boolean;
  /** Whether to show video controls */
  controls?: boolean;
  /** Optional CSS class name for the container */
  className?: string;
  /** Custom aspect ratio using Tailwind aspect-ratio classes (default: 'aspect-video' for 16:9) */
  aspectRatio?: 'aspect-square' | 'aspect-video' | 'aspect-[4/3]' | 'aspect-[3/2]' | 'aspect-[21/9]';
  /** Callback function called when video starts playing */
  onPlay?: () => void;
  /** Callback function called when video is paused */
  onPause?: () => void;
  /** Callback function called when video ends */
  onEnded?: () => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * A responsive video player component that maintains aspect ratio using Tailwind CSS.
 *
 * @example
 * ```tsx
 * <VideoPlayer
 *   src="/videos/demo.mp4"
 *   poster="/images/video-thumbnail.jpg"
 *   aria-label="Product demonstration video"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom aspect ratio (4:3) with autoplay
 * <VideoPlayer
 *   src="/videos/demo.mp4"
 *   aspectRatio="aspect-[4/3]"
 *   autoplay
 *   muted
 *   loop
 *   className="shadow-lg"
 * />
 * ```
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
  className = '',
  aspectRatio = 'aspect-video',
  onPlay,
  onPause,
  onEnded,
  'aria-label': ariaLabel,
}) => {
  return (
    <div
      className={cn(
        // Container with aspect ratio and responsive design
        'tuwadocs:relative tuwadocs:w-full tuwadocs:overflow-hidden tuwadocs:rounded-lg tuwadocs:bg-black tuwadocs:my-4',
        aspectRatio, // Dynamically applies aspect ratio class
        className,
      )}
    >
      <video
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        className={cn(
          // Video fills container completely
          'tuwadocs:absolute tuwadocs:inset-0 tuwadocs:h-full tuwadocs:w-full tuwadocs:object-contain',
          // Smooth transitions and focus states
          'tuwadocs:transition-opacity tuwadocs:duration-200',
          'tuwadocs:focus:outline-none tuwadocs:focus:ring-2 tuwadocs:focus:ring-blue-500 tuwadocs:focus:ring-offset-2',
        )}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        aria-label={ariaLabel}
        preload="metadata"
      >
        <track kind="captions" />
        Your browser does not support the video tag. Please{' '}
        <a href={src} download className="tuwadocs:text-blue-400 tuwadocs:underline tuwadocs:hover:text-blue-300">
          download the video
        </a>{' '}
        to watch it.
      </video>
    </div>
  );
};

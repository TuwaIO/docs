import type { SegmentId } from '@/lib/comparisons';

/** Color of the competitors of each segment, on the radar, in the picker and on the cards */
export const SEGMENT_COLORS: Record<SegmentId, string> = {
  connectors: '#0ea5e9',
  embedded: '#f59e0b',
  platforms: '#10b981',
  indexing: '#f43f5e',
};

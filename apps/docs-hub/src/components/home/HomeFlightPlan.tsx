'use client';

import type { FlightWaypoint } from '@tuwaio/docs-ui';

import { useI18n } from '@/i18n';
import { layers } from '@/lib/ecosystem';

import { PageFlightPlan } from '../PageFlightPlan';

/**
 * The flight plan of the main page (`PageFlightPlan`): from the overview past the sections with a bar (Ecosystem,
 * Packages) and the five stage ledgers to the quick start, the Earth. The ledger of the stage the reader reads takes
 * `data-flight="here"`, which turns the square of its number to the accent.
 *
 * @returns The flight plan.
 */
export function HomeFlightPlan() {
  const { t } = useI18n();
  const waypoints: FlightWaypoint[] = [
    { id: 'overview', kind: 'section', number: '00', name: t.common.flight.overview },
    { id: 'ecosystem', kind: 'section', number: '01', name: t.home.board.section },
    { id: 'packages', kind: 'section', number: '02', name: t.home.ledger.section },
    ...layers.map((_, index) => ({
      id: `stage-${index + 1}`,
      kind: 'stage' as const,
      name: t.home.timeline.stages[index + 1]?.title ?? '',
    })),
    { id: 'quick-start', kind: 'section', number: '03', name: t.home.quickStart.section },
  ];
  return <PageFlightPlan waypoints={waypoints} />;
}

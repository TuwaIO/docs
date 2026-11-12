'use client';

import { docsLabels, FlightPlan, type FlightWaypoint } from '@tuwaio/docs-ui';
import { ScrollToTopButton } from '@tuwaio/nova-core';

import { useI18n } from '@/i18n';

/**
 * The flight plan of a page of the hub: `FlightPlan` of docs-ui with its names in the language of the page and, where
 * the plan is the strip under the header (below 1280px), the button of Nova that takes the reader back to the top. The
 * rail has a link to every part of the page, the first of them its top; the strip has none, so the button stands in for
 * it there, and from 1280px the page has no such button.
 *
 * @param props.waypoints - The parts of the page, from the top: the first is where the craft starts, the last is the
 * Earth.
 * @returns The flight plan and the button.
 */
export function PageFlightPlan({ waypoints }: { waypoints: readonly FlightWaypoint[] }) {
  const { locale, t } = useI18n();

  return (
    <>
      <FlightPlan waypoints={waypoints} labels={t.common.flight} />
      {/* Important rules: the styles of Nova come after these. Under the menu of the header, and gone where the rail is */}
      <ScrollToTopButton label={docsLabels[locale].nextra.scrollToTop} className="!z-40 xl:!hidden" />
    </>
  );
}

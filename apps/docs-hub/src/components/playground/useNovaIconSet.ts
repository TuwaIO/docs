'use client';

import type { NovaIconSet } from '@tuwaio/sdk/nova-core';
import { useEffect, useState } from 'react';

import type { NovaIconSetChoice } from '@/lib/playground/customization';

/**
 * The icon set the stage gives to the Nova providers (their `icons` prop). The pixel icons are Nova's own: nothing to
 * give. The Heroicons set is loaded when the reader first picks it, so the Playground loads `@heroicons/react` only
 * then; until it has loaded, Nova keeps its pixel icons.
 *
 * Side effect: a dynamic import of `@tuwaio/sdk/nova-core/heroicons`, once.
 *
 * @param choice - The icon set of the customization.
 * @returns The Heroicons set, or `undefined` for the pixel icons of Nova.
 */
export function useNovaIconSet(choice: NovaIconSetChoice): NovaIconSet | undefined {
  const [classic, setClassic] = useState<NovaIconSet>();

  useEffect(() => {
    if (choice !== 'classic' || classic) return;
    let mounted = true;
    void import('@tuwaio/sdk/nova-core/heroicons').then(({ heroicons }) => {
      if (mounted) setClassic(heroicons);
    });
    return () => {
      mounted = false;
    };
  }, [choice, classic]);

  return choice === 'classic' ? classic : undefined;
}

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { changeSmoothly } from '../../../../packages/docs-ui/src/localeRouting';
import { PreferenceExpiry, quietSkippedPageTransitions } from '../../../../packages/docs-ui/src/preferences';

// Owner 11-09: a change of language showed «Runtime AbortError: Transition was skipped» in the dev overlay. The
// crossfade of a change is a view transition; the browser skips it when the change loads another root layout (a new
// document) or another transition starts, and then rejects its `ready` promise. Nobody else waits for it, so the
// crossfade itself must take that rejection, or it surfaces as an unhandled error.
describe('the crossfade of a change of language', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('changes the language, and takes a skipped transition quietly', async () => {
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    const skipped = Object.assign(new Error('Transition was skipped'), { name: 'AbortError' });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal('document', {
      startViewTransition: (update: () => Promise<void>) => {
        void update();
        return {
          ready: Promise.reject(skipped),
          finished: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
        };
      },
    });
    const change = vi.fn();

    changeSmoothly(change);
    await new Promise((resolve) => setTimeout(resolve, 20));
    process.off('unhandledRejection', unhandled);

    expect(change).toHaveBeenCalledOnce();
    expect(unhandled).not.toHaveBeenCalled();
  });

  it('just changes it where the browser has no view transitions', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal('document', {});
    const change = vi.fn();
    changeSmoothly(change);
    expect(change).toHaveBeenCalledOnce();
  });
});

// The same for the crossfade of a page load: a change to another root layout loads a new document, which crossfades by
// the `@view-transition` rule of `site.css`. When the browser skips that crossfade (the page took long, the tab went to
// the background) the `ready` promise of the transition it hands to `pagereveal` is rejected; the head script of every
// site takes it.
describe('the crossfade of a page load', () => {
  it('takes a skipped transition quietly', async () => {
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    const listeners: Record<string, (event: unknown) => void> = {};
    const skipped = () => Promise.reject(Object.assign(new Error('Transition was skipped'), { name: 'AbortError' }));
    quietSkippedPageTransitions({
      addEventListener: (type: string, listener: (event: unknown) => void) => {
        listeners[type] = listener;
      },
      // The page can be revealed before the head script runs: the crossfade is then already the active one
      document: { activeViewTransition: { ready: skipped() } },
    } as unknown as Window);
    listeners.pagereveal({ viewTransition: { ready: skipped() } });
    listeners.pagereveal({ viewTransition: null });
    await new Promise((resolve) => setTimeout(resolve, 20));
    process.off('unhandledRejection', unhandled);
    expect(unhandled).not.toHaveBeenCalled();
  });

  it('is in the head script of the stored preferences', () => {
    expect(renderToStaticMarkup(createElement(PreferenceExpiry, { keys: ['theme'] }))).toContain(
      '(function quietSkippedPageTransitions',
    );
  });
});

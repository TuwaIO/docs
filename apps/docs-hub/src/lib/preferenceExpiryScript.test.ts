import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PreferenceExpiry } from '../../../../packages/docs-ui/src/preferences';

// Owner 11-08: switching the language showed an error in the dev overlay, «Encountered a script tag while rendering
// React component». `/`, `/uk` and `/zh-CN` are separate root layouts, so a switch renders the new one on the client,
// and React reports every `<script>` it creates there (such a script never runs). The script of the stored preferences
// runs once, when the page loads: it is rendered on the server and kept while the page hydrates, never on the client.
// The test picks the snapshot React would take: the server one while rendering on the server or hydrating, the client
// one in a render that starts on the client.
const render = vi.hoisted(() => ({ onClient: false }));
vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>();
  return {
    ...react,
    useSyncExternalStore: <T>(_subscribe: unknown, getSnapshot: () => T, getServerSnapshot: () => T) =>
      render.onClient ? getSnapshot() : getServerSnapshot(),
  };
});

describe('the script of the stored preferences', () => {
  it('is in the page the server renders, and hydrates', () => {
    render.onClient = false;
    const html = renderToStaticMarkup(createElement(PreferenceExpiry, { keys: ['theme', 'tuwa-locale'] }));
    expect(html).toMatch(/^<script>\(function expireStoredPreferences/);
    expect(html).toContain('["theme","tuwa-locale"]');
  });

  it('is not rendered by React on the client, where it would not run', () => {
    render.onClient = true;
    expect(renderToStaticMarkup(createElement(PreferenceExpiry, { keys: ['theme'] }))).toBe('');
  });
});

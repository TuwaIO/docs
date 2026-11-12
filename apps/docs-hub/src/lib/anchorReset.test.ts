import { readFileSync } from 'node:fs';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { addressWithoutAnchor, dropAnchor } from '../../../../packages/docs-ui/src/anchor';

// A change of the language or the theme starts the page anew: the anchor a link of the page opened (a project of the
// board, a stage) goes, so the page in the new language does not jump back to that part. The query stays: a shared
// link of the configurator keeps its stack in it.

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui/src');
const read = (file: string) => readFileSync(path.join(docsUi, file), 'utf8');

describe('the anchor on a change of the language or the theme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps the path and the query of an address, without its anchor', () => {
    expect(addressWithoutAnchor({ pathname: '/uk/configurator', search: '?stack=evm' })).toBe(
      '/uk/configurator?stack=evm',
    );
    expect(addressWithoutAnchor({ pathname: '/', search: '' })).toBe('/');
  });

  it('removes the anchor in place, keeping the state of the history entry', () => {
    const replaceState = vi.fn();
    const state = { __NA: true };
    vi.stubGlobal('window', {
      location: { pathname: '/zh-CN', search: '?a=1', hash: '#p-pulsar' },
      history: { state, replaceState },
    });
    dropAnchor();
    expect(replaceState).toHaveBeenCalledWith(state, '', '/zh-CN?a=1');
  });

  it('leaves an address without an anchor alone', () => {
    const replaceState = vi.fn();
    vi.stubGlobal('window', {
      location: { pathname: '/', search: '', hash: '' },
      history: { state: null, replaceState },
    });
    dropAnchor();
    expect(replaceState).not.toHaveBeenCalled();
  });

  it('opens the page in a language the reader picks without the anchor', () => {
    const source = read('localeRouting.tsx');
    const picker = source.slice(source.indexOf('return (target: string) =>'));
    expect(picker).not.toContain('location.hash');
    expect(picker).toContain('addressWithoutAnchor(');
    expect(picker).toContain('dropAnchor()');
  });

  it('drops the anchor when the theme switch is clicked, before the theme changes', () => {
    const source = read('components/ThemeSwitcher.tsx');
    const click = source.slice(source.indexOf('onClick={() => {'), source.indexOf('className={cn('));
    expect(click.indexOf('dropAnchor()')).toBeGreaterThan(-1);
    expect(click.indexOf('dropAnchor()')).toBeLessThan(click.indexOf('onToggle()'));
  });
});

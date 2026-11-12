import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

// The pixel arrows of the hero buttons step the way they point while the button is under the pointer or the keyboard:
// once, not in a loop, and not at all for reduced motion

const source = readFileSync(path.resolve(__dirname, '../components/HeroSection.tsx'), 'utf8');

describe('the arrows of the hero buttons', () => {
  it('step down and right on hover and keyboard focus', () => {
    expect(source).toContain('group-hover:translate-y-[3px] group-focus-visible:translate-y-[3px]');
    expect(source).toContain('group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]');
    expect(source).toMatch(/const buttonClassName =\s*'group /);
  });

  it('move once, and stay still for reduced motion', () => {
    expect(source).toContain('motion-reduce:transition-none motion-reduce:!translate-none');
    expect(source).not.toMatch(/animate-|infinite/);
  });
});

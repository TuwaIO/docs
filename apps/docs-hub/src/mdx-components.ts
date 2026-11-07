import type { MDXComponents } from 'nextra/mdx-components';
import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';

import { LocaleLink } from './components/LocaleLink';

const themeComponents = getThemeComponents();

export function useMDXComponents(components?: MDXComponents) {
  return {
    ...themeComponents,
    a: LocaleLink,
    ...components,
  };
}

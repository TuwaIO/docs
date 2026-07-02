import { defineConfig } from 'tsup';

import pkg from './package.json';

export default defineConfig([
  {
    format: ['cjs', 'esm'],
    entry: ['./src/**/*.ts', './src/**/*.tsx'],
    bundle: false,
    clean: true,
    dts: true,
    outExtension({ format }) {
      return {
        js: `.${format === 'esm' ? 'js' : 'cjs'}`,
      };
    },
    external: [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.devDependencies || {})],
  },
]);

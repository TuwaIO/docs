import path from 'node:path';

import { defineConfig } from 'vitest/config';

// Unit tests of the Playground: the simulation (src/lib/playground) and the copyable Nova files (their tests sit in
// components/playground, outside nova/, whose files the Code tab lists); the other components are checked in the browser
export default defineConfig({
  // The `@/` of the app (tsconfig `paths`), for the tests that render a component
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});

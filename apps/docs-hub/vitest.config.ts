import { defineConfig } from 'vitest/config';

// Unit tests of the Playground: the simulation (src/lib/playground) and the copyable Nova files (their tests sit in
// components/playground, outside nova/, whose files the Code tab lists); the other components are checked in the browser
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});

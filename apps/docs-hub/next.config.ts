process.env.NEXT_TELEMETRY_DISABLED = '1';

import nextra from 'nextra';

// Set up Nextra with its configuration
const withNextra = nextra({
  defaultShowCopyCode: true,
});

// Export the final Next.js config with Nextra included
export default withNextra({
  // Two root layouts: an unknown URL has no layout of its own to render its 404 in
  experimental: { globalNotFound: true },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
});

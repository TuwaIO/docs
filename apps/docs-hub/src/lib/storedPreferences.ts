/**
 * The interface settings the hub keeps in Local Storage. The script of `PreferenceExpiry` in the head of every page
 * dates each write of them and forgets each 30 days after it was chosen (Cookie Policy), whatever library writes it:
 * the theme (next-themes), the network tab of the guides (Nextra), the language, the package manager of the install
 * commands (`packageManager.ts`) and the HTTP client of the Quasar API reference (Scalar, which keeps it under its own
 * key).
 */
export const STORED_PREFERENCES = [
  'theme',
  'tuwa-guide-network',
  'tuwa-locale',
  'tuwa-docs-hub:package-manager',
  'scalar-reference-selected-client-v2',
];

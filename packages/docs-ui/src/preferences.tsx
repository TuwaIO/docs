/** How long the TUWA sites keep an interface setting after it is chosen (Cookie Policy). */
export const PREFERENCE_DAYS = 30;

/**
 * Forgets the given Local Storage values once their 30 days have passed (or when they were saved before values had an
 * expiry), then dates every later write of those keys: `<key>:expires` holds the time in epoch milliseconds. It runs
 * inline in the page head, before next-themes or Nextra read the values, so it works whatever library writes them;
 * it is serialised with `toString()`, so it uses only its arguments.
 *
 * @param storage - `window.localStorage`.
 * @param proto - `Storage.prototype`, whose `setItem` is wrapped to date the writes of `keys`.
 * @param keys - The keys of the interface settings, such as `theme`.
 * @param ms - How long a value is kept after it is written.
 * @param now - The current time.
 */
export function expireStoredPreferences(
  storage: Storage,
  proto: Pick<Storage, 'setItem'>,
  keys: string[],
  ms: number,
  now: number,
): void {
  try {
    for (const key of keys) {
      const expiresAt = Number(storage.getItem(key + ':expires'));
      if (!expiresAt || expiresAt <= now) {
        storage.removeItem(key);
        storage.removeItem(key + ':expires');
      }
    }
    const setItem = proto.setItem;
    proto.setItem = function (this: Storage, key: string, value: string) {
      setItem.call(this, key, value);
      if (this === storage && keys.indexOf(key) >= 0) setItem.call(this, key + ':expires', String(Date.now() + ms));
    };
  } catch {
    // Storage blocked: nothing is remembered either
  }
}

/**
 * The inline script of {@link expireStoredPreferences}, for the `<head>` of a site's root layout, before the theme
 * script of next-themes.
 *
 * @param props.keys - The Local Storage keys to keep for {@link PREFERENCE_DAYS} days; `theme` by default.
 */
export function PreferenceExpiry({ keys = ['theme'] }: { keys?: string[] }) {
  const ms = PREFERENCE_DAYS * 86_400_000;
  const code = `(${expireStoredPreferences.toString()})(window.localStorage, Storage.prototype, ${JSON.stringify(keys)}, ${ms}, Date.now())`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

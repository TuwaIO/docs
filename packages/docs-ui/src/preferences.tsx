import { InlineScript } from './inlineScript';

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
 * Takes the crossfade of a page load quietly when the browser skips it. A change to another root layout (another
 * language) loads a new document, which crossfades by the `@view-transition` rule of `site.css`; when the browser skips
 * that crossfade (the page took long, the tab went to the background) it rejects the `ready` promise of the transition
 * it hands to `pagereveal`, and nothing else waits for it. It runs inline in the page head; the page can be revealed
 * before it runs, so it also takes the crossfade that is already active. It is serialised with `toString()`, so it uses
 * only its argument.
 *
 * @param target - `window`.
 */
export function quietSkippedPageTransitions(target: Pick<Window, 'addEventListener' | 'document'>): void {
  const quiet = (transition: ViewTransition | null | undefined) => {
    if (transition) transition.ready.catch(() => {});
  };
  quiet((target.document as Document & { activeViewTransition?: ViewTransition | null }).activeViewTransition);
  target.addEventListener('pagereveal', (event) => {
    quiet((event as Event & { viewTransition?: ViewTransition | null }).viewTransition);
  });
}

/**
 * The inline script of {@link expireStoredPreferences} and {@link quietSkippedPageTransitions}, for the `<head>` of a
 * site's root layout, before the theme script of next-themes.
 *
 * @param props.keys - The Local Storage keys to keep for {@link PREFERENCE_DAYS} days; `theme` by default.
 */
export function PreferenceExpiry({ keys = ['theme'] }: { keys?: string[] }) {
  const ms = PREFERENCE_DAYS * 86_400_000;
  const code = `(${expireStoredPreferences.toString()})(window.localStorage, Storage.prototype, ${JSON.stringify(keys)}, ${ms}, Date.now());(${quietSkippedPageTransitions.toString()})(window)`;
  // Runs once, when the page loads; a switch to another root layout (`/` → `/uk`) renders no script on the client
  return <InlineScript code={code} />;
}

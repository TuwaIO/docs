/** The assembling pixel art in a part, or the part itself when it is one. */
const artsIn = (part: Element) =>
  part.matches('.tuwa-pixel-art--assemble') ? [part] : [...part.querySelectorAll('.tuwa-pixel-art--assemble')];

/**
 * Starts the motion of the pixel art in a part the reader points at (a link, a card): the picture assembles again,
 * faster, then plays the motion of its icon (`PixelArt` with `motion`) until {@link stopPixelMotion}. Pixel art drawn
 * with `assemble` only (its pixels know where they fly from); nothing for reduced motion (`site.css`).
 *
 * Side effects: sets the classes `tuwa-pixel-art--settled` (the picture no longer plays its first assembly) and
 * `tuwa-pixel-art--live` on the art anew, which restarts its CSS animations.
 *
 * @param part - The part, or the pixel art itself.
 */
export function startPixelMotion(part: Element): void {
  for (const art of artsIn(part)) {
    art.classList.remove('tuwa-pixel-art--live');
    // Read the layout, so the motion starts again on an art that has just played it
    void art.getBoundingClientRect();
    art.classList.add('tuwa-pixel-art--settled', 'tuwa-pixel-art--live');
  }
}

/**
 * Stops the motion that {@link startPixelMotion} started: the picture rests where it is drawn, without assembling again.
 *
 * Side effects: removes the class `tuwa-pixel-art--live` from the art.
 *
 * @param part - The part, or the pixel art itself.
 */
export function stopPixelMotion(part: Element): void {
  for (const art of artsIn(part)) art.classList.remove('tuwa-pixel-art--live');
}

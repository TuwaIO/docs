import type { CSSProperties } from 'react';

/**
 * Where a pixel goes when its picture folds away: up to 4 cells off its place on one axis. Integer arithmetic, so the
 * server and every browser render the same markup.
 */
const offsetOf = (index: number, axis: number) => {
  const seed = (Math.imul(index + 1, 2654435761) ^ Math.imul(axis + 1, 40503)) >>> 0;
  return ((seed % 81) - 40) / 10;
};

/**
 * A pixel picture that folds away and unfolds: while `folded` its pixels are scattered around their places, out of
 * sight; when it unfolds they fly in to their places one after another, and when it folds they fly apart the same way
 * (`tuwa-pixel-fold` in the stylesheet; at once for reduced motion). The pixels take the colour of the text
 * (`currentColor`). Decorative: hidden from assistive technology.
 *
 * @param props.art - The picture, row by row: `.` is empty, any other character a pixel.
 * @param props.folded - Whether the picture is folded away.
 * @param props.className - Classes of the `svg`: its size.
 * @returns The `svg`.
 */
export function PixelFold({
  art,
  folded,
  className = '',
}: {
  art: readonly string[];
  folded: boolean;
  className?: string;
}) {
  const columns = art[0]?.length ?? 0;
  let index = 0;
  return (
    <svg
      viewBox={`0 0 ${columns} ${art.length}`}
      aria-hidden="true"
      focusable="false"
      data-folded={folded ? '' : undefined}
      className={`tuwa-pixel-fold tuwadocs:overflow-visible tuwadocs:fill-current ${className}`}
    >
      {art.flatMap((row, y) =>
        [...row].map((pixel, x) => {
          if (pixel === '.') return null;
          const place = index++;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1.02}
              height={1.02}
              style={
                { '--i': place, '--dx': `${offsetOf(place, 0)}px`, '--dy': `${offsetOf(place, 1)}px` } as CSSProperties
              }
            />
          );
        }),
      )}
    </svg>
  );
}

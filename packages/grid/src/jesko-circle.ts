import { BinaryGrid } from './binary-grid';

/**
 * Draw a circle outline in a tile grid.
 *
 * @see {@link https://schwarzers.com/algorithms/}
 * @see {@link https://en.wikipedia.org/wiki/Midpoint_circle_algorithm}
 *
 * @remarks
 * This will only draw the outline.
 * The grid will be modified in place.
 *
 * @param grid - The grid you want to use
 * @param centerX - The x center of the circle
 * @param centerY - The y center of the circle
 * @param radius - The radius of the circle
 * @param fillType - The bit which should be written at the grid position. Defaults to 1.
 */
export function jeskoCircle(
  grid: BinaryGrid,
  centerX: number,
  centerY: number,
  radius: number,
  fillType: 0 | 1 = 1,
): void {
  let y = 0;
  let x = radius;
  let t1 = radius >> 4;
  let t2: number;

  while (x >= y) {
    grid[x + centerX][y + centerY] = fillType;
    grid[y + centerX][x + centerY] = fillType;
    grid[-x + centerX][y + centerY] = fillType;
    grid[-y + centerX][x + centerY] = fillType;
    grid[-x + centerX][-y + centerY] = fillType;
    grid[-y + centerX][-x + centerY] = fillType;
    grid[x + centerX][-y + centerY] = fillType;
    grid[y + centerX][-x + centerY] = fillType;

    y++;
    t1 += y;
    t2 = t1 - x;

    if (t2 >= 0) {
      t1 = t2;
      x--;
    }
  }
}

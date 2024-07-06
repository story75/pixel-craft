import type { BinaryGrid } from './binary-grid';

export type FillOptions = {
  /**
   * A function that generates a random number between 0 and 1.
   */
  rng: () => number;

  /**
   * The threshold for the random number to be considered a wall.
   */
  threshold: number;

  /**
   * If true, the edges of the grid will be considered walls.
   */
  fillEdges?: boolean;
};

export type GridOptions = {
  /**
   * The width of the grid.
   */
  width: number;

  /**
   * The height of the grid.
   */
  height: number;

  /**
   * Options to fill the grid with random values.
   *
   * @remarks
   * If not provided, the grid will be filled with zeros.
   */
  fillOptions?: FillOptions;
};

/**
 * Generate a random grid.
 *
 * @remarks
 * The grid will be filled with random values of either 0 or 1.
 * You may consider 0 as empty space and 1 as a wall.
 *
 * If `fillOptions` is omitted, the grid will be filled with zeros.
 */
export function randomGrid(options: GridOptions): BinaryGrid {
  const { width, height, fillOptions } = options;
  const grid: BinaryGrid = [];

  for (let x = 0; x < width; x++) {
    grid.push([]);

    for (let y = 0; y < height; y++) {
      if (!fillOptions) {
        grid[x][y] = 0;
        continue;
      }

      const isEdge = x === 0 || x === width - 1 || y === 0 || y === height - 1;
      if (isEdge && fillOptions.fillEdges) {
        grid[x][y] = 1;
        continue;
      }

      const value = fillOptions.rng();
      grid[x][y] = value < fillOptions.threshold ? 1 : 0;
    }
  }

  return grid;
}

import { randomInRange } from '@pixel-craft/math';
import { BinaryGrid } from './binary-grid';

export type WalkerOptions = {
  /**
   * The amount of walkers to generate.
   */
  walkers: number;

  /**
   * The minimum path length for each walker.
   */
  minPathLength: number;

  /**
   * The maximum path length for each walker.
   */
  maxPathLength: number;

  /**
   * The starting X position for each walker.
   *
   * @remarks
   * If not provided, the starting X position will be random.
   */
  startX?: number;

  /**
   * The starting Y position for each walker.
   *
   * @remarks
   * If not provided, the starting Y position will be random.
   */
  startY?: number;

  /**
   * The random number generator function.
   *
   * @remarks
   * The function should return a random number between 0 and 1.
   */
  rng: () => number;
};

/**
 * Helper type to encode directions into x,y additions.
 */
type Direction = [number, number];

/**
 * Change cell values in the grid based on random walkers.
 *
 * @remarks
 * The grid is expected to be a 2D array of 0s at the beginning.
 * The walkers will change the values of the cells they visit to 1.
 *
 * @param grid - The grid to modify in place.
 * @param options - The options for the random walkers.
 */
export function randomWalker(grid: BinaryGrid, options: WalkerOptions): void {
  const directions: Direction[] = [
    [-1, 0], //left
    [1, 0], //right
    [0, -1], //down
    [0, 1], //up
  ];

  const width = grid.length;
  const height = grid[0].length;

  const startX = options.startX ?? randomInRange(options.rng, 0, width);
  const startY = options.startY ?? randomInRange(options.rng, 0, height);

  const getRandomDirection = (): Direction => directions[randomInRange(options.rng, 0, directions.length)];

  let direction = getRandomDirection();
  let lastDirection: Direction | undefined;
  let x = startX;
  let y = startY;
  let pathLength: number;

  const step = (xS: number, yS: number): Direction => [xS + direction[0], yS + direction[1]];
  const isValidCell = (xS: number, yS: number) => xS >= 0 && xS < width && yS >= 0 && yS < height;

  const changeDirection = () => {
    direction = getRandomDirection();
    const isValidDirection = isValidCell(...step(x, y));
    const isDifferentDirection = !lastDirection || direction !== lastDirection;
    if (!isValidDirection || !isDifferentDirection) {
      changeDirection();
    }
  };

  for (let i = 0; i < options.walkers; i++) {
    pathLength = randomInRange(options.rng, options.minPathLength, options.maxPathLength + 1);
    changeDirection();

    // Step until path length or map boundary reached
    for (let j = 0; j < pathLength; j++) {
      // Check if step is possible or reset to start
      if (!isValidCell(...step(x, y))) {
        x = startX;
        y = startY;
      }

      // Perform step
      [x, y] = step(x, y);
      grid[y][x] = 1;

      changeDirection();
    }

    lastDirection = direction;
  }
}

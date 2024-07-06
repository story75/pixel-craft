import type { BinaryGrid } from './binary-grid';

/**
 * Get the number of neighbours of a cell.
 *
 * @param grid - The grid to get the neighbours from.
 * @param x - The x coordinate of the cell.
 * @param y - The y coordinate of the cell.
 * @param outOfBoundsValue - The value to consider when a cell is out of bounds.
 * @returns The number of neighbours of the cell.
 */
export function getNeighbours(grid: BinaryGrid, x: number, y: number, outOfBoundsValue: 0 | 1 = 0): number {
  let neighbours = 0;

  for (let cX = -1; cX <= 1; cX++) {
    for (let cY = -1; cY <= 1; cY++) {
      if (cX === 0 && cY === 0) {
        continue;
      }

      const value = grid[x + cX]?.[y + cY] ?? outOfBoundsValue;
      if (value) {
        neighbours++;
      }
    }
  }
  return neighbours;
}

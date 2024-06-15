import { BinaryGrid } from './binary-grid';
import { getNeighbours } from './get-neighbours';

/**
 * Smooth a grid in place by upgrading or downgrading cells based on the number of neighbours.
 *
 * @param grid - The grid to smooth.
 * @param upgradeCount - If the neighbours of a cell are greater than this number, the cell will be upgraded to 1.
 * @param downgradeCount - If the neighbours of a cell are less than this number, the cell will be downgraded to 0.
 * @param outOfBoundsValue - The value to consider when a cell is out of bounds.
 */
export function smoothGrid(grid: BinaryGrid, upgradeCount = 6, downgradeCount = 3, outOfBoundsValue: 0 | 1 = 0): void {
  const width = grid.length;
  const height = grid[0].length;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const neighbours = getNeighbours(grid, x, y, outOfBoundsValue);
      if (neighbours > upgradeCount) {
        grid[x][y] = 1;
      } else if (neighbours < downgradeCount) {
        grid[x][y] = 0;
      }
    }
  }
}

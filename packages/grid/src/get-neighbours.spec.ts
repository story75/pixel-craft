import { describe, expect, it } from 'bun:test';
import type { BinaryGrid } from './binary-grid';
import { getNeighbours } from './get-neighbours';

describe('getNeighbours', () => {
  it('should get the number of neighbours of a cell', () => {
    const grid: BinaryGrid = [
      [1, 1, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    const x = 1;
    const y = 1;

    expect(getNeighbours(grid, x, y)).toBe(5);
  });

  it('should get the number of neighbours of a cell with out of bounds value', () => {
    const grid: BinaryGrid = [
      [1, 1, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    const x = 0;
    const y = 0;

    expect(getNeighbours(grid, x, y, 1)).toBe(7);
  });
});

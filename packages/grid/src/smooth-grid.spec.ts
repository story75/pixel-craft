import { describe, expect, it } from 'bun:test';
import type { BinaryGrid } from './binary-grid';
import { smoothGrid } from './smooth-grid';

describe('smoothGrid', () => {
  it('should smooth a grid with empty edges', () => {
    const grid: BinaryGrid = [
      [1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 0],
      [1, 0, 1, 0, 1, 0],
      [1, 0, 1, 1, 1, 0],
      [1, 0, 1, 1, 1, 0],
      [1, 0, 1, 1, 1, 0],
    ];

    smoothGrid(grid, 6, 3, 0);

    expect(grid).toEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0],
    ]);
  });

  it('should smooth a grid with closed edges', () => {
    const grid: BinaryGrid = [
      [1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 0],
      [1, 0, 1, 0, 1, 0],
      [1, 0, 1, 1, 1, 0],
      [1, 0, 1, 1, 1, 0],
      [1, 0, 1, 1, 1, 0],
    ];

    smoothGrid(grid, 6, 3, 1);

    expect(grid).toEqual([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
  });
});

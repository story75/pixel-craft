import { describe, expect, it } from 'bun:test';
import type { BinaryGrid } from './binary-grid';
import { getRegions } from './flood-fill';

describe('floodFill', () => {
  const grid: BinaryGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  it('should find every room of the same tile type (filled tile)', () => {
    const regions = getRegions(grid, 1);

    expect(regions).toEqual([
      [
        {
          x: 0,
          y: 0,
          type: 1,
        },
        {
          x: 1,
          y: 0,
          type: 1,
        },
        {
          x: 2,
          y: 0,
          type: 1,
        },
        {
          x: 3,
          y: 0,
          type: 1,
        },
        {
          x: 4,
          y: 0,
          type: 1,
        },
        {
          x: 5,
          y: 0,
          type: 1,
        },
        {
          x: 6,
          y: 0,
          type: 1,
        },
        {
          x: 7,
          y: 0,
          type: 1,
        },
        {
          x: 8,
          y: 0,
          type: 1,
        },
        {
          x: 8,
          y: 1,
          type: 1,
        },
        {
          x: 8,
          y: 2,
          type: 1,
        },
        {
          x: 8,
          y: 3,
          type: 1,
        },
        {
          x: 8,
          y: 4,
          type: 1,
        },
        {
          x: 8,
          y: 5,
          type: 1,
        },
        {
          x: 8,
          y: 6,
          type: 1,
        },
        {
          x: 8,
          y: 7,
          type: 1,
        },
        {
          x: 8,
          y: 8,
          type: 1,
        },
        {
          x: 7,
          y: 8,
          type: 1,
        },
        {
          x: 6,
          y: 8,
          type: 1,
        },
        {
          x: 5,
          y: 8,
          type: 1,
        },
        {
          x: 4,
          y: 8,
          type: 1,
        },
        {
          x: 3,
          y: 8,
          type: 1,
        },
        {
          x: 2,
          y: 8,
          type: 1,
        },
        {
          x: 1,
          y: 8,
          type: 1,
        },
        {
          x: 0,
          y: 8,
          type: 1,
        },
        {
          x: 0,
          y: 7,
          type: 1,
        },
        {
          x: 0,
          y: 6,
          type: 1,
        },
        {
          x: 0,
          y: 5,
          type: 1,
        },
        {
          x: 0,
          y: 4,
          type: 1,
        },
        {
          x: 0,
          y: 3,
          type: 1,
        },
        {
          x: 0,
          y: 2,
          type: 1,
        },
        {
          x: 0,
          y: 1,
          type: 1,
        },
      ],
      [
        {
          x: 2,
          y: 2,
          type: 1,
        },
        {
          x: 3,
          y: 2,
          type: 1,
        },
        {
          x: 4,
          y: 2,
          type: 1,
        },
        {
          x: 5,
          y: 2,
          type: 1,
        },
        {
          x: 6,
          y: 2,
          type: 1,
        },
        {
          x: 6,
          y: 3,
          type: 1,
        },
        {
          x: 6,
          y: 4,
          type: 1,
        },
        {
          x: 6,
          y: 5,
          type: 1,
        },
        {
          x: 6,
          y: 6,
          type: 1,
        },
        {
          x: 5,
          y: 6,
          type: 1,
        },
        {
          x: 4,
          y: 6,
          type: 1,
        },
        {
          x: 3,
          y: 6,
          type: 1,
        },
        {
          x: 2,
          y: 6,
          type: 1,
        },
        {
          x: 2,
          y: 5,
          type: 1,
        },
        {
          x: 2,
          y: 4,
          type: 1,
        },
        {
          x: 2,
          y: 3,
          type: 1,
        },
      ],
    ]);
  });

  it('should find every room of the same tile type (empty tile)', () => {
    const regions = getRegions(grid, 0);

    expect(regions).toEqual([
      [
        {
          x: 1,
          y: 1,
          type: 0,
        },
        {
          x: 2,
          y: 1,
          type: 0,
        },
        {
          x: 3,
          y: 1,
          type: 0,
        },
        {
          x: 4,
          y: 1,
          type: 0,
        },
        {
          x: 5,
          y: 1,
          type: 0,
        },
        {
          x: 6,
          y: 1,
          type: 0,
        },
        {
          x: 7,
          y: 1,
          type: 0,
        },
        {
          x: 7,
          y: 2,
          type: 0,
        },
        {
          x: 7,
          y: 3,
          type: 0,
        },
        {
          x: 7,
          y: 4,
          type: 0,
        },
        {
          x: 7,
          y: 5,
          type: 0,
        },
        {
          x: 7,
          y: 6,
          type: 0,
        },
        {
          x: 7,
          y: 7,
          type: 0,
        },
        {
          x: 6,
          y: 7,
          type: 0,
        },
        {
          x: 5,
          y: 7,
          type: 0,
        },
        {
          x: 4,
          y: 7,
          type: 0,
        },
        {
          x: 3,
          y: 7,
          type: 0,
        },
        {
          x: 2,
          y: 7,
          type: 0,
        },
        {
          x: 1,
          y: 7,
          type: 0,
        },
        {
          x: 1,
          y: 6,
          type: 0,
        },
        {
          x: 1,
          y: 5,
          type: 0,
        },
        {
          x: 1,
          y: 4,
          type: 0,
        },
        {
          x: 1,
          y: 3,
          type: 0,
        },
        {
          x: 1,
          y: 2,
          type: 0,
        },
      ],
      [
        {
          x: 3,
          y: 3,
          type: 0,
        },
        {
          x: 4,
          y: 3,
          type: 0,
        },
        {
          x: 5,
          y: 3,
          type: 0,
        },
        {
          x: 5,
          y: 4,
          type: 0,
        },
        {
          x: 5,
          y: 5,
          type: 0,
        },
        {
          x: 4,
          y: 5,
          type: 0,
        },
        {
          x: 3,
          y: 5,
          type: 0,
        },
        {
          x: 4,
          y: 4,
          type: 0,
        },
        {
          x: 3,
          y: 4,
          type: 0,
        },
      ],
    ]);
  });
});

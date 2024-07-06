import { describe, expect, it } from 'bun:test';
import { type FillOptions, randomGrid } from './random-grid';

describe('randomGrid', () => {
  it('should generate an empty grid', () => {
    const width = 3;
    const height = 5;
    const grid = randomGrid({ width, height });

    expect(grid.length).toBe(width);
    expect(grid[0].length).toBe(height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        expect(grid[x][y]).toBe(0);
      }
    }
  });

  it('should generate a random grid with fill options', () => {
    let step = 0;
    const rng = () => {
      return step++ % 2;
    };

    const width = 3;
    const height = 3;
    const threshold = 0.5;
    const fillOptions: FillOptions = { threshold, rng };
    const grid = randomGrid({ width, height, fillOptions });

    expect(grid.length).toBe(width);
    expect(grid[0].length).toBe(height);

    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const expected = (++i % 2) as 0 | 1;
        expect(grid[x][y]).toBe(expected);
      }
    }
  });

  it('should generate a random grid with fill options and fill edges', () => {
    let step = 0;
    const rng = () => {
      return step++ % 2;
    };

    const width = 3;
    const height = 3;
    const threshold = 0.5;
    const fillOptions: FillOptions = { threshold, rng, fillEdges: true };
    const grid = randomGrid({ width, height, fillOptions });

    expect(grid.length).toBe(height);
    expect(grid[0].length).toBe(width);

    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const isEdge = x === 0 || x === width - 1 || y === 0 || y === height - 1;
        const expected = isEdge ? 1 : ((++i % 2) as 0 | 1);
        expect(grid[x][y]).toBe(expected);
      }
    }
  });
});

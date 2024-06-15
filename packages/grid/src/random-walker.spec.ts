import { describe, expect, it } from 'bun:test';
import { BinaryGrid } from './binary-grid';
import { randomWalker } from './random-walker';

describe('randomWalker', () => {
  it('should walk randomly', () => {
    const grid: BinaryGrid = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];

    const generator = function* () {
      let i = 0;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (true) {
        yield i;
        i += 0.1;
        if (i >= 1) {
          i = 0;
        }
      }
    };
    const gen = generator();

    randomWalker(grid, {
      walkers: 5,
      minPathLength: 5,
      maxPathLength: 10,
      rng: () => gen.next().value,
    });

    expect(grid).toEqual([
      [1, 1, 1, 1, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 0],
      [1, 1, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 0],
    ]);
  });
});

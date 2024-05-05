import { describe, expect, it } from 'bun:test';
import { uniformSpriteSheet } from './uniform-sprite-sheet';

describe('uniformSpriteSheet', () => {
  it('should parse a sprite sheet into rect[x][y]', () => {
    expect(
      uniformSpriteSheet({
        tileSize: 16,
        width: 128,
        height: 128,
      }),
    ).toEqual([
      [
        {
          x: 0,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 0,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 16,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 32,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 32,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 48,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 48,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 64,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 64,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 80,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 80,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 96,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 96,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
      [
        {
          x: 112,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 16,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 32,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 48,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 64,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 80,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 96,
          width: 16,
          height: 16,
        },
        {
          x: 112,
          y: 112,
          width: 16,
          height: 16,
        },
      ],
    ]);
  });
});

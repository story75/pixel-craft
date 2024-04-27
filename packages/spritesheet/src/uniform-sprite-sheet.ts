import { Rect } from '@pixel-craft/engine';

type Options = {
  /**
   * The size of each tile in the sprite sheet in pixels
   */
  tileSize: number;

  /**
   * The width of the sprite sheet in pixels
   */
  width: number;

  /**
   * The height of the sprite sheet in pixels
   */
  height: number;
};

/**
 * Parse all frames of a sprite sheet with uniform tiles.
 */
export function uniformSpriteSheet(options: Options): Rect[][] {
  const tilesX = options.width / options.tileSize;
  const tilesY = options.height / options.tileSize;

  const frames: Rect[][] = [];
  for (let x = 0; x < tilesX; x++) {
    frames.push([]);
    for (let y = 0; y < tilesY; y++) {
      frames[x].push({
        x: x * options.tileSize,
        y: y * options.tileSize,
        width: options.tileSize,
        height: options.tileSize,
      });
    }
  }

  return frames;
}

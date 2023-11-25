/**
 * An instance of a sprite which can be rendered to a canvas
 */
export interface Sprite {
  texture: GPUTexture;
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Create a sprite from a texture.
 *
 * @remarks
 * The width and height will automatically be taken from the texture.
 *
 * @param texture - The texture to use
 * @param x - X coordinate of the sprite. 0 by default
 * @param y - Y coordinate of the sprite. 0 by default
 */
export function sprite(texture: GPUTexture, x = 0, y = 0): Sprite {
  return {
    texture,
    width: texture.width,
    height: texture.height,
    x,
    y,
  };
}

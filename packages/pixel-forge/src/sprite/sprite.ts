/**
 * An instance of a sprite which can be rendered to a canvas
 */
export type Sprite = {
  texture: GPUTexture;
  width: number;
  height: number;
  x: number;
  y: number;
};

/**
 * Create a sprite from a texture.
 *
 * @remarks
 * The width and height will automatically be taken from the texture.
 *
 * @param texture - The texture to use
 */
export function sprite(texture: GPUTexture): Sprite {
  return {
    texture,
    width: texture.width,
    height: texture.height,
    x: 0,
    y: 0,
  };
}

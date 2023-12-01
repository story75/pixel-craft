import { Rect } from '../math/rect';
import { Vec2 } from '../math/vec2';
import { Vec3 } from '../math/vec3';

/**
 * An instance of a sprite which can be rendered to a canvas
 */
export type Sprite = Rect & {
  /**
   * The texture to render
   */
  texture: GPUTexture;

  /**
   * The frame of the texture to render
   */
  frame: Rect;

  /**
   * The rotation of the sprite in radians
   */
  rotation: number;

  /**
   * Options to flip the sprite
   *
   * @remarks
   * The first value is whether to flip the sprite horizontally, and the second value is whether to flip the sprite vertically.
   * If the value is true, the sprite will be flipped. If the value is false, the sprite will not be flipped.
   * This is useful for rendering a sprite facing left or right, without having to create a separate texture.
   * This will not affect the frame of the sprite, but just change the uv coordinates.
   */
  flip: [boolean, boolean];

  /**
   * The origin of the sprite
   *
   * @remarks
   * The origin is a value between 0 and 1 which represents the position of the origin relative to the sprite.
   * For example, [0, 0] would be the top left corner of the sprite, [0.5, 0.5] would be the center of the sprite, and [1, 1] would be the bottom right corner of the sprite.
   */
  origin: Vec2;

  /**
   * The color of the sprite
   *
   * @remarks
   * The color is a value between 0 and 1 for each channel (red, green, blue).
   * If all channels are 1, the sprite will be rendered normally.
   */
  color: Vec3;

  /**
   * The alpha of the sprite
   *
   * @remarks
   * The alpha is a value between 0 and 1.
   * If the alpha is 0, the sprite will not be rendered.
   * If the alpha is 1, the sprite will be rendered normally.
   */
  alpha: number;
};

/**
 * Create a sprite from a texture.
 *
 * @remarks
 * The width and height will automatically be taken from the texture, if not specified.
 * The frame will automatically be set to the entire texture, if not specified.
 * The origin will automatically be set to the top left corner of the sprite, if not specified.
 */
export function sprite(
  data: Pick<Sprite, 'texture'> & Omit<Partial<Sprite>, 'texture'>,
): Sprite {
  return {
    texture: data.texture,
    width: data.width ?? data.texture.width,
    height: data.height ?? data.texture.height,
    x: data.x ?? 0,
    y: data.y ?? 0,
    frame: data.frame ?? {
      x: 0,
      y: 0,
      width: data.texture.width,
      height: data.texture.height,
    },
    flip: data.flip ?? [false, false],
    rotation: data.rotation ?? 0,
    origin: data.origin ?? [0, 0],
    color: data.color ?? [1, 1, 1],
    alpha: data.alpha ?? 1,
  };
}

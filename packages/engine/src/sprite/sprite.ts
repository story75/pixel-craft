import { Point2 } from '@pixel-craft/math';
import { Rect } from './rect';

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
   *
   * @remarks
   * The frame is a rectangle which represents the portion of the texture to render.
   * By default, the frame will be the entire texture.
   * If the frame is smaller than the texture, only the portion of the texture within the frame will be rendered.
   *
   * If a frame is specified, the width and height of the sprite will be set to the width and height of the frame if not explicitly specified.
   */
  frame: Rect;

  /**
   * The rotation of the sprite in radians
   */
  rotation: number;

  /**
   * The z-index of the sprite
   *
   * @remarks
   * The z-index is a positive integer which represents the order in which the sprite will be rendered.
   * Sprites with a higher z-index will be rendered on top of sprites with a lower z-index.
   * The value must be between 0 and 1. Default is 0.001.
   */
  z: number;

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
  origin: Point2;

  /**
   * The color of the sprite
   *
   * @remarks
   * The color is a value between 0 and 1 for each channel (red, green, blue).
   * If all channels are 1, the sprite will be rendered normally.
   */
  color: [number, number, number];

  /**
   * The alpha of the sprite
   *
   * @remarks
   * The alpha is a value between 0 and 1.
   * If the alpha is 0, the sprite will not be rendered.
   * If the alpha is 1, the sprite will be rendered normally.
   */
  alpha: number;

  /**
   * The sampler to use when rendering the sprite
   *
   * @remarks
   * This is useful for rendering a sprite with a different sampler than the default sampler.
   * The default sampler is 'nearest'.
   *
   * Because the sampler is part of the bind group layout, all sprites in a batch will use the same sampler.
   */
  sampler: 'linear' | 'nearest';
};

/**
 * A sprite which will be rendered with a repeating texture.
 */
export type TilingSprite = Sprite & {
  /**
   * The mode to repeat the texture.
   *
   * @remarks
   * Only 'repeat' is supported at the moment.
   * This is useful for rendering a parallax background. The texture will be repeated in the x and y direction.
   * This property will indicate to the renderer to use a different pipeline to render the sprite.
   */
  mode: 'repeat';

  /**
   * The offset of the texture.
   *
   * @remarks
   * The offset indicates how much to offset the texture in the x and y direction. The value is a percentage value, with 0 being no offset, and 1 being the full width or height of the texture.
   * The offset value is relative to the texture size. If the texture is 100px wide, and the offset is 0.5, the texture will be offset by 50px.
   * If the value is greater than 1, the texture will be offset by the remainder. For example, if the texture is 100px wide, and the offset is 1.5, the texture will be offset by 50px.
   */
  offset: Point2;
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
    width: data.width ?? data.frame?.width ?? data.texture.width,
    height: data.height ?? data.frame?.height ?? data.texture.height,
    x: data.x ?? 0,
    y: data.y ?? 0,
    z: data.z ?? 0.001,
    frame: data.frame ?? {
      x: 0,
      y: 0,
      width: data.texture.width,
      height: data.texture.height,
    },
    flip: data.flip ?? [false, false],
    rotation: data.rotation ?? 0,
    origin: data.origin ?? { x: 0, y: 0 },
    color: data.color ?? [1, 1, 1],
    alpha: data.alpha ?? 1,
    sampler: data.sampler ?? 'nearest',
  };
}

/**
 * Create a tiling sprite from a texture.
 *
 * @remarks
 * The width and height will automatically be taken from the texture, if not specified.
 * The frame will automatically be set to the entire texture, if not specified.
 * The origin will automatically be set to the top left corner of the sprite, if not specified.
 */
export function tilingSprite(
  data: Pick<TilingSprite, 'texture'> & Omit<Partial<TilingSprite>, 'texture'>,
): TilingSprite {
  return {
    ...sprite(data),
    mode: 'repeat',
    offset: data.offset ?? { x: 0, y: 0 },
  };
}

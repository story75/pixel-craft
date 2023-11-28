import {Vec2} from "../math/vec2";
import {Rect} from "../math/rect";

/**
 * An instance of a sprite which can be rendered to a canvas
 */
export type Sprite = Rect & {
  texture: GPUTexture;
  frame: Rect;
  rotation: number;
  origin: Vec2;
}

/**
 * Create a sprite from a texture.
 *
 * @remarks
 * The width and height will automatically be taken from the texture.
 */
export function sprite(data: Pick<Sprite, 'texture'> & Omit<Partial<Sprite>, 'texture'>): Sprite {
  return {
    texture: data.texture,
    width: data.width ?? data.texture.width,
    height: data.height ?? data.texture.height,
    x: data.x ?? 0,
    y: data.y ?? 0,
    frame: data.frame ?? {x: 0, y: 0, width: data.texture.width, height: data.texture.height},
    rotation: data.rotation ?? 0,
    origin: data.origin ?? [0, 0],
  };
}

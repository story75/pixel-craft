import { Sprite, TilingSprite } from '../../../sprite/sprite';

/**
 * A render pass that renders a list of sprites.
 *
 * @remarks
 * The render pass will render the sprites in batches, where each batch contains sprites that share the same texture.
 * This is done for performance reasons, as it allows us to minimize the number of texture bind group switches and draw calls.
 *
 * The render pass will also reuse index buffers, which are pre-allocated and shared between all batches.
 * Texture bind groups are also reused, but they are allocated on demand, as needed.
 * Vertex buffers are also reused, but they are also allocated on demand, as needed.
 * This is done to minimize the number of GPU memory allocations, which are expensive.
 *
 * The render pass is expected to be called once per frame.
 */
export type RenderPass = (sprites: Iterable<Sprite | TilingSprite>) => void;

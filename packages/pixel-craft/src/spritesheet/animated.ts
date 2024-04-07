import { Rect } from '@pixel-craft/engine';

type Options = {
  /**
   * The width of each frame for the sprite in pixels
   */
  frameWidth: number;

  /**
   * The height of each frame for the sprite in pixels
   */
  frameHeight: number;

  /**
   * The width of the sprite sheet in pixels
   */
  width: number;

  /**
   * The height of the sprite sheet in pixels
   */
  height: number;

  /**
   * The animations to parse
   */
  animations: Array<{
    /**
     * The name of the animation
     */
    name: string;

    /**
     * The row of the animation
     *
     * @remarks
     * The animation is expected to have every frame in a single row from left to right.
     */
    row: number;

    /**
     * The frames of the animation
     *
     * @remarks
     * If frames is not provided, the remaining row of the sprite sheet will be used.
     * For example, if the sprite sheet has 10 frames with a startFrame of 4, the animation will have 6 frames.
     */
    frames?: number;

    /**
     * The column of the animation
     *
     * @remarks
     * If you have multiple animations in a single row, you can specify the column to start from.
     * If not provided, the column will start from 0.
     */
    startFrame?: number;
  }>;
};

/**
 * Parse all frames of a sprite sheet with animations.
 */
export function animatedSpriteSheet(options: Options): Record<string, Rect[]> {
  const framesX = options.width / options.frameWidth;

  const animations: Record<string, Rect[]> = {};
  for (const animation of options.animations) {
    animations[animation.name] = [];
    const startFrame = animation.startFrame ?? 0;
    const frames = animation.frames ?? framesX - startFrame;
    for (let frame = 0; frame < frames; frame++) {
      animations[animation.name].push({
        x: (startFrame + frame) * options.frameWidth,
        y: animation.row * options.frameHeight,
        width: options.frameWidth,
        height: options.frameHeight,
      });
    }
  }

  return animations;
}

import { Animated, Animator } from '@pixel-craft/animator';
import { Sprite, sprite } from '@pixel-craft/engine';
import { animatedSpriteSheet } from './animated-sprite-sheet';

type Options<T extends Record<string, unknown> | undefined> = Pick<
  Partial<Sprite>,
  'x' | 'y' | 'z'
> &
  Pick<Animated<T & Sprite>, 'transitions'> & {
    /**
     * The width of each frame for the sprite in pixels
     */
    frameWidth: number;

    /**
     * The height of each frame for the sprite in pixels
     */
    frameHeight: number;

    /**
     * The atlas texture
     */
    atlas: GPUTexture;

    /**
     * The animations
     */
    animations: Array<{
      /**
       * The name of the animation
       */
      name: string;

      /**
       * The speed of the animation.
       *
       * @remarks
       * The speed is defined in frames per second e.g. 5 means the animation will change every 5 frames.
       */
      speed: number;

      /**
       * Does the animation loop.
       */
      loop?: boolean;

      /**
       * Is the animation interruptible.
       */
      interruptible?: boolean;

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

export function spriteParser<T extends Record<string, unknown> | undefined>(
  options: Options<T>,
  data: T,
): T & Sprite & Animated<T & Sprite> {
  const spriteSheet = animatedSpriteSheet({
    frameWidth: options.frameWidth,
    frameHeight: options.frameHeight,
    width: options.atlas.width,
    height: options.atlas.height,
    animations: options.animations,
  });

  const animated = Animator.createAnimated({
    animations: options.animations.reduce<Animated['animations']>(
      (acc, animation) => {
        acc[animation.name] = {
          ...animation,
          loop: animation.loop ?? false,
          interruptible: animation.interruptible ?? false,
          animationFrames: spriteSheet[animation.name],
        };
        return acc;
      },
      {},
    ),
    // TODO: The types for Animated and especially transitions are too cumbersome to work with right now.
    // eslint-disable-next-line
    transitions: options.transitions as any,
  });

  return {
    ...sprite({
      texture: options.atlas,
      x: options.x,
      y: options.y,
      z: options.z,
      frame: animated.animation.animationFrames[0],
    }),
    ...animated,
    ...data,
  };
}
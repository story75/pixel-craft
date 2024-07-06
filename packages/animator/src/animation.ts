import type { Rect } from '@pixel-craft/math';

/**
 * Defines an animation consisting of multiple frames.
 */
export type Animation = {
  /**
   * The name of the animation.
   *
   * @remarks
   * This is used to reference the animation in transitions.
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
  loop: boolean;

  /**
   * Is the animation interruptible.
   */
  interruptible: boolean;

  /**
   * The frames of the animation.
   */
  animationFrames: Rect[];

  /**
   * Executes when the animation ends.
   *
   * @remarks
   * If the animation loops, this will be called every time the animation ends.
   */
  onEnd?: () => void;

  /**
   * Executes when the animation frame changes.
   *
   * @remarks
   * This is called after the frame changes with the new frame index.
   */
  onFrame?: (frame: number) => void;
};
